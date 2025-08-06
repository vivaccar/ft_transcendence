const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Deleta todos os registros da tabela "User"
await prisma.user.delete({
  where: { email: 'vaccarivvh@gmail.com' }
});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });