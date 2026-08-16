import app from './app.js';

// import { prisma } from './lib/prisma.js';

// async function testDb() {
//   await prisma.$connect();
//   console.log('✅ Connected to Neon \n');

//   const users = await prisma.users.findMany();
//   console.log('\n Users:', users);

//   await prisma.$disconnect();
// }

// testDb();

const PORT = Number(process.env.PORT);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT} \n`);
});
