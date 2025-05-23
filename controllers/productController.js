const Product = require('../models/productModel');
const { Op } = require('sequelize');
const { importProductsFromCSV, exportProductsToCSV } = require('../utils/csvUtils');
const csv = require('fast-csv');
const fs = require('fs');

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.path;
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Product creation failed', detail: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, name } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (name) where.name = { [Op.iLike]: `%${name}%` };

    const products = await Product.findAndCountAll({ where, limit: +limit, offset: +offset });

    res.json({
      total: products.count,
      pages: Math.ceil(products.count / limit),
      data: products.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Fetching products failed' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });

    const data = req.body;
    if (req.file) data.image = req.file.path;

    await product.update(data);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
};

exports.softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });

    await product.destroy(); // soft delete (paranoid: true)
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

exports.importCSV = async (req, res) => {
  try {
    const count = await importProductsFromCSV(req.file.path);
    res.status(200).json({ message: `${count} products imported.` });
  } catch (err) {
    res.status(500).json({ error: 'CSV import failed.', detail: err.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    await exportProductsToCSV(res);
  } catch (err) {
    res.status(500).json({ error: 'CSV export failed.', detail: err.message });
  }
};
