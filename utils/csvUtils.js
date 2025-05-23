const csv = require('fast-csv');
const fs = require('fs');
const Product = require('../models/productModel');

exports.importProductsFromCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const products = [];

    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('data', row => {
        products.push({
          name: row.name,
          SKU: row.SKU,
          category: row.category,
          description: row.description,
          costPrice: parseFloat(row.costPrice),
          sellingPrice: parseFloat(row.sellingPrice),
          supplierId: row.supplierId ? parseInt(row.supplierId) : null,
          threshold: parseInt(row.threshold),
          status: row.status
        });
      })
      .on('end', async () => {
        try {
          await Product.bulkCreate(products, { validate: true });
          resolve(products.length);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', err => reject(err));
  });
};

exports.exportProductsToCSV = async (res) => {
  const products = await Product.findAll();

  res.setHeader('Content-disposition', 'attachment; filename=products.csv');
  res.setHeader('Content-Type', 'text/csv');

  const csvStream = csv.format({ headers: true });
  csvStream.pipe(res);

  products.forEach(product => {
    csvStream.write(product.toJSON());
  });

  csvStream.end();
};
    