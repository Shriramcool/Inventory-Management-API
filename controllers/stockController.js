// controllers/stockController.js

const Stock = require('../models/stockModel');
const Product = require('../models/productModel');
const StockLog = require('../models/stockLogModel');

// Add stock
exports.addStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const stock = await Stock.findOne({ productId });
    if (stock) {
      stock.quantity += quantity;
      await stock.save();
    } else {
      await Stock.create({ productId, quantity });
    }

    await StockLog.create({ productId, quantity, type: 'add' });

    res.status(200).json({ message: 'Stock added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Add stock failed', detail: err.message });
  }
};

// Remove stock
exports.removeStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const stock = await Stock.findOne({ productId });
    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    stock.quantity -= quantity;
    await stock.save();

    await StockLog.create({ productId, quantity, type: 'remove' });

    res.status(200).json({ message: 'Stock removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Remove stock failed', detail: err.message });
  }
};

// Transfer stock (from one product ID to another — for special cases)
exports.transferStock = async (req, res) => {
  try {
    const { fromProductId, toProductId, quantity } = req.body;

    const fromStock = await Stock.findOne({ productId: fromProductId });
    const toStock = await Stock.findOne({ productId: toProductId });

    if (!fromStock || fromStock.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient source stock' });
    }

    fromStock.quantity -= quantity;
    await fromStock.save();

    if (toStock) {
      toStock.quantity += quantity;
      await toStock.save();
    } else {
      await Stock.create({ productId: toProductId, quantity });
    }

    await StockLog.create({ productId: fromProductId, quantity, type: 'transfer_out' });
    await StockLog.create({ productId: toProductId, quantity, type: 'transfer_in' });

    res.status(200).json({ message: 'Stock transferred successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Transfer failed', detail: err.message });
  }
};

// Get stock by product ID
exports.getStockByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const stock = await Stock.findOne({ productId });

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found for this product' });
    }

    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
};

