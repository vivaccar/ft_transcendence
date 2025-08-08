import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 20;

  if (!userId) {
    console.error('❌ Por favor, forneça o ID do usuário como argumento.');
    process.exit(1);
  }

  // Verifica se o usuário existe
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    console.log(`⚠️ Usuário com ID '${userId}' não encontrado.`);
    process.exit(0);
  }

  // Deleta o usuário
  await prisma.user.delete({
    where: { id: userId },
  });

  console.log(`✅ Usuário com ID '${userId}' deletado com sucesso.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao deletar usuário:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });