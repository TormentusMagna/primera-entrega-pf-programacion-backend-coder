import { Router } from 'express';
import { join } from 'path';
import { __dirname } from '../utils.js';
import ProductManager from '../ProductManager.js';

const router = Router();
const admin = new ProductManager(join(__dirname, 'data', 'productList.json'));

const productRoutes = () => {
  // Get all products
  router.get('/api/products', async (req, res) => {
    try {
      const { limit } = req.query;
      const products = await admin.getProducts(limit);
      return res.status(200).json(products);
    } catch (err) {
      console.log(err);
    }
  });

  // Get a single product
  router.get('/api/products/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await admin.getProduct(pid);
      if (product.msg === "The product you're looking for not exists") {
        return res.status(404).json(product);
      } else {
        return res.status(200).json(product);
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Add product
  router.post('/api/products', async (req, res) => {
    try {
      const productData = req.body;
      const newProduct = await admin.addProduct(productData);
      if (
        newProduct.msg ===
        'All fields are required. Fill all data and try again'
      ) {
        return res.status(400).json(newProduct);
      } else {
        return res.status(200).json(newProduct);
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Update a product
  router.put('/api/products/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const dataToUpdate = req.body;
      const updated = await admin.updateProduct(pid, dataToUpdate);
      if (updated.msg === "The product you're looking for not exists") {
        return res.status(404).json(updated);
      } else {
        return res.status(200).json(updated);
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Delete a product
  router.delete('/api/products/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const deleted = await admin.deleteProduct(pid);
      if (deleted.msg === "The product you're looking for not exists") {
        return res.status(404).json(deleted);
      } else {
        return res.status(200).json(deleted);
      }
    } catch (err) {
      console.log(err);
    }
  });

  return router;
};

export default productRoutes;
