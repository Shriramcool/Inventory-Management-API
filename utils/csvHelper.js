const fs = require('fs');
const csv = require('fast-csv');

exports.writeProductsToCSV = (products, filePath) => {
  const ws = fs.createWriteStream(filePath);
  csv.write(products, { headers: true }).pipe(ws);
};

exports.parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', reject)
      .on('data', row => data.push(row))
      .on('end', () => resolve(data));
  });
};
