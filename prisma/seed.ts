import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpa
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  // Cria usuários
  const hash = await bcrypt.hash('123456', 10);
  const user1 = await prisma.user.create({
    data: { name: 'Alice', email: 'alice@alice.com', password: hash, balance: 500 },
  });
  const user2 = await prisma.user.create({
    data: { name: 'Bob', email: 'bob@bob.com', password: hash, balance: 300 },
  });

  // Cria transações de exemplo
  await prisma.transaction.create({
    data: {
      type: 'DEPOSIT',
      status: 'COMPLETED',
      amount: 200,
      userId: user1.id,
    },
  });
  await prisma.transaction.create({
    data: {
      type: 'TRANSFER',
      status: 'COMPLETED',
      amount: 50,
      userId: user1.id,
      receiverId: user2.id,
    },
  });

  console.log('Seed executado com sucesso!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
