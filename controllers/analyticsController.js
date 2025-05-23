const Product = require('../models/productModel');
const Stock = require('../models/stockModel');
const StockMovement = require('../models/stockLogModel');
const StockLog = require('../models/stockLogModel');

exports.getInventorySummary = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const activeProducts = await Product.count({ where: { status: 'active' } });
    const outOfStock = await Product.count({ where: { status: 'out_of_stock' } });
    const discontinued = await Product.count({ where: { status: 'discontinued' } });

    res.json({
      totalProducts,
      activeProducts,
      outOfStock,
      discontinued
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary', detail: err.message });
  }
};

exports.getStockValuation = async (req, res) => {
  try {
    const method = req.query.method || 'cost'; // 'cost' or 'selling'

    const stocks = await Stock.findAll({
      include: Product
    });

    const totalValue = stocks.reduce((acc, stock) => {
      const price = method === 'selling'
        ? stock.Product.sellingPrice
        : stock.Product.costPrice;
      return acc + stock.quantity * price;
    }, 0);

    res.json({
      valuationMethod: method,
      totalValue
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate valuation', detail: err.message });
  }
};

exports.getReorderSuggestions = async (req, res) => {
  try {
    const lowStockProducts = await Product.findAll({
      where: Sequelize.literal(`"quantity" < "threshold"`),
      attributes: ['id', 'name', 'quantity', 'threshold']
    });

    res.json({ reorderSuggestions: lowStockProducts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate reorder list', detail: err.message });
  }
};

exports.getTopLeastSelling = async (req, res) => {
  try {
    const sales = await StockMovement.findAll({
      where: { movementType: 'out' },
      attributes: [
        'productId',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold']
      ],
      group: ['productId'],
      order: [[Sequelize.literal('totalSold'), 'DESC']],
      limit: 5,
      include: Product
    });

    const leastSales = await StockMovement.findAll({
      where: { movementType: 'out' },
      attributes: [
        'productId',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold']
      ],
      group: ['productId'],
      order: [[Sequelize.literal('totalSold'), 'ASC']],
      limit: 5,
      include: Product
    });

    res.json({
      topSelling: sales,
      leastSelling: leastSales
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate sales report', detail: err.message });
  }
};

exports.getMonthlySalesVsRestocks = async (req, res) => {
  try {
    const month = req.query.month || new Date().getMonth() + 1;
    const year = req.query.year || new Date().getFullYear();

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const sales = await StockMovement.findAll({
      where: {
        movementType: 'out',
        timestamp: {
          [Sequelize.Op.between]: [startDate, endDate]
        }
      },
      attributes: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalOut']]
    });

    const restocks = await StockMovement.findAll({
      where: {
        movementType: 'in',
        timestamp: {
          [Sequelize.Op.between]: [startDate, endDate]
        }
      },
      attributes: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalIn']]
    });

    res.json({
      month,
      year,
      totalOut: sales[0]?.dataValues?.totalOut || 0,
      totalIn: restocks[0]?.dataValues?.totalIn || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate monthly report', detail: err.message });
  }
};

exports.getInventoryStats = async (req, res) => {
  try {
    const totalSKUs = await Product.countDocuments();
    const inStock = await Stock.aggregate([
      { $group: { _id: '$productId', total: { $sum: '$quantity' } } },
      { $match: { total: { $gt: 0 } } },
    ]);
    const outOfStock = totalSKUs - inStock.length;

    const products = await Product.find();
    let valuation = 0;
    for (const product of products) {
      const stock = await Stock.aggregate([
        { $match: { productId: product._id } },
        { $group: { _id: null, qty: { $sum: '$quantity' } } }
      ]);
      const qty = stock[0]?.qty || 0;
      valuation += qty * product.costPrice;
    }

    res.json({ totalSKUs, inStock: inStock.length, outOfStock, stockValuation: valuation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Analytics error' });
  }
};

exports.getReorderSuggestions = async (req, res) => {
  try {
    const products = await Product.find();
    const suggestions = [];

    for (const product of products) {
      const stock = await Stock.aggregate([
        { $match: { productId: product._id } },
        { $group: { _id: null, qty: { $sum: '$quantity' } } }
      ]);
      const qty = stock[0]?.qty || 0;
      if (qty < product.threshold) {
        suggestions.push({ product: product.name, currentStock: qty, threshold: product.threshold });
      }
    }

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reorder suggestions' });
  }
};

exports.getSalesVsRestocks = async (req, res) => {
  try {
    const now = new Date();
    const last6Months = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const logs = await StockLog.aggregate([
      { $match: { timestamp: { $gte: last6Months } } },
      {
        $project: {
          month: { $month: '$timestamp' },
          type: '$movementType',
          qty: '$quantity',
        }
      },
      {
        $group: {
          _id: { month: '$month', type: '$type' },
          total: { $sum: '$qty' }
        }
      }
    ]);

    const result = {};
    for (const log of logs) {
      const m = log._id.month;
      const t = log._id.type;
      result[m] = result[m] || { sales: 0, restocks: 0 };
      if (t === 'out') result[m].sales += log.total;
      if (t === 'in') result[m].restocks += log.total;
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sales/restocks' });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const logs = await StockLog.aggregate([
      { $match: { movementType: 'out' } },
      {
        $group: {
          _id: '$productId',
          totalSold: { $sum: '$quantity' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    const topProducts = await Promise.all(logs.map(async (entry) => {
      const product = await Product.findById(entry._id);
      return {
        product: product?.name,
        totalSold: entry.totalSold
      };
    }));

    res.json({ topSelling: topProducts });
  } catch (err) {
    res.status(500).json({ message: 'Top selling error' });
  }
};