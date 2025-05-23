const StockMovement = require('../models/stockLogModel');
const Product = require('../models/productModel');
const { Op } = require('sequelize');

exports.logMovement = async (req, res) => {
  try {
    const { productId, quantity, movementType, remarks } = req.body;
    const userId = req.user.id;

    const movement = await StockMovement.create({
      productId,
      userId,
      quantity,
      movementType,
      remarks
    });

    res.status(201).json({ message: 'Movement logged', movement });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log movement', detail: err.message });
  }
};

exports.getMovements = async (req, res) => {
  try {
    const { productId, movementType, startDate, endDate } = req.query;

    const filters = {};
    if (productId) filters.productId = productId;
    if (movementType) filters.movementType = movementType;
    if (startDate || endDate) {
      filters.timestamp = {
        ...(startDate && { [Op.gte]: new Date(startDate) }),
        ...(endDate && { [Op.lte]: new Date(endDate) })
      };
    }

    const movements = await StockMovement.findAll({
      where: filters,
      order: [['timestamp', 'DESC']],
      include: Product
    });

    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve movement logs', detail: err.message });
  }
};
