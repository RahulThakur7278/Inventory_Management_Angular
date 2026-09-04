const Product = require('../models/Product');
const Category = require('../models/Category');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const lowStockProducts = await Product.find({ quantity: { $lt: 10 } })
      .populate('category', 'name')
      .limit(10);

    res.json({
      totalProducts,
      totalCategories,
      lowStockCount: await Product.countDocuments({ quantity: { $lt: 10 } }),
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardStats };
