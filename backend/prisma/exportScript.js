const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportData() {
  try {
    // Query data from the desired table (replace 'yourModel' with your Prisma model name)
    const data = await prisma.post.findMany();

    // Convert the data to JSON format
    const jsonData = JSON.stringify(data, null, 2);

    // Write the JSON data to a file
    fs.writeFileSync('exported-data.json', jsonData);

    console.log('Data exported successfully to exported-data.json');
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
