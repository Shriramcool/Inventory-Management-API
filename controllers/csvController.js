const Product = require('../models/productModel');
const { writeProductsToCSV, parseCSV } = require('../utils/csvHelper');
const path = require('path');
const fs = require('fs');

exports.exportProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        'name', 'SKU', 'category', 'description',
        'costPrice', 'sellingPrice', 'threshold', 'status', 'supplierId'
      ]
    });

    const filePath = path.join(__dirname, '../temp/products_export.csv');
    writeProductsToCSV(products, filePath);

    res.download(filePath, 'products.csv', err => {
      if (err) console.error('File download error:', err);
      fs.unlinkSync(filePath); // Delete after sending
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to export products', detail: err.message });
  }
};

exports.importProducts = async (req, res) => {
  try {
    const filePath = req.file.path;
    const rows = await parseCSV(filePath);

    const inserted = [];
    for (const row of rows) {
      if (!row.SKU || !row.name || !row.costPrice) continue;

      const [product, created] = await Product.upsert({
        name: row.name,
        SKU: row.SKU,
        category: row.category || null,
        description: row.description || '',
        costPrice: parseFloat(row.costPrice),
        sellingPrice: parseFloat(row.sellingPrice),
        supplierId: row.supplierId || null,
        threshold: parseInt(row.threshold),
        status: row.status || 'active'
      });
      inserted.push(product);
    }

    fs.unlinkSync(filePath);
    res.status(200).json({ message: `${inserted.length} products imported.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import CSV', detail: err.message });
  }
};
