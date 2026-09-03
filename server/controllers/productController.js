const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
      
    const products = await Product.find({ ...keyword })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, category, purchasePrice, sellingPrice, quantity } = req.body;
    
    if (!name || !sku || !category || purchasePrice == null || sellingPrice == null || quantity == null) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const skuExists = await Product.findOne({ sku });
    if (skuExists) {
      return res.status(400).json({ message: 'SKU must be unique' });
    }

    const product = await Product.create({
      name,
      sku,
      category,
      purchasePrice,
      sellingPrice,
      quantity,
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, sku, category, purchasePrice, sellingPrice, quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check unique sku if it's changing
      if (sku && sku !== product.sku) {
        const skuExists = await Product.findOne({ sku });
        if (skuExists) {
           return res.status(400).json({ message: 'SKU must be unique' });
        }
      }

      product.name = name || product.name;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.purchasePrice = purchasePrice ?? product.purchasePrice;
      product.sellingPrice = sellingPrice ?? product.sellingPrice;
      product.quantity = quantity ?? product.quantity;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
