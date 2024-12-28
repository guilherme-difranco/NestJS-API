import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bull';

const prisma = new PrismaClient();

describe('App E2E', () => {
  let app: INestApplication;
  let token: string;
  let transactionQueue: Queue;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Limpa o banco antes de começar os testes
    await prisma.transaction.deleteMany({
      where: { user: { email: { endsWith: '@example.com' } } },
    });
    await prisma.user.deleteMany({
      where: { email: { endsWith: '@example.com' } },
    });

    // Cria usuário e realiza login para obter o token
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Teste E2E',
        email: 'teste.e2e@example.com',
        password: '123456',
      })
      .expect(201);

    const resp = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'teste.e2e@example.com',
        password: '123456',
      })
      .expect(200);

    token = resp.body.access_token;

    // Inicializa fila de transações
    transactionQueue = app.get('BullQueue_transaction');
  });

  afterAll(async () => {
    // Limpa o banco após os testes
    await prisma.transaction.deleteMany({
      where: { user: { email: { endsWith: '@example.com' } } },
    });
    await prisma.user.deleteMany({
      where: { email: { endsWith: '@example.com' } },
    });
    await app.close();
  });

  describe('Auth', () => {
    it('Deve criar um novo usuário', async () => {
      const resp = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'Teste Novo',
          email: 'novo@example.com',
          password: '123456',
        })
        .expect(201);

      expect(resp.body).toHaveProperty('message', 'Usuário criado com sucesso');
    });

    it('Deve logar com sucesso', async () => {
      const resp = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'novo@example.com',
          password: '123456',
        })
        .expect(200);

      expect(resp.body).toHaveProperty('access_token');
    });
  });

  describe('Transaction', () => {
    it('Deve realizar um depósito de 50', async () => {
      const resp = await request(app.getHttpServer())
        .post('/transaction/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 50,
        })
        .expect(201);

      expect(resp.body).toHaveProperty('message', 'Depósito em processamento.');

      // Aguarda o job ser processado
      const job = await new Promise((resolve) => {
        const interval = setInterval(async () => {
          const jobs = await transactionQueue.getJobs(['completed']);
          const foundJob = jobs.find(j => j.data.amount === 50);
          if (foundJob) {
            clearInterval(interval);
            resolve(foundJob);
          }
        }, 100);
      });

      expect(job).toBeDefined();
    });

    it('Deve falhar sem enviar Bearer token', async () => {
      await request(app.getHttpServer())
        .post('/transaction/deposit')
        .send({ amount: 10 })
        .expect(401);
    });

    it('Deve falhar se amount <= 0', async () => {
      await request(app.getHttpServer())
        .post('/transaction/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: -1 })
        .expect(201); // Confirmação inicial da criação

      // Aguarda o job ser processado e marcado como falho
      const job = await new Promise((resolve) => {
        const interval = setInterval(async () => {
          const jobs = await transactionQueue.getJobs(['failed']);
          const foundJob = jobs.find(j => j.data.amount === -1);
          if (foundJob) {
            clearInterval(interval);
            resolve(foundJob);
          }
        }, 100);
      });

      expect(job).toBeDefined();
      expect((job as any).failedReason).toContain('O valor do depósito deve ser maior que zero.');

    });
  });
});
