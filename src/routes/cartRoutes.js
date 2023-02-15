import { Router } from 'express';
import { join } from 'path';
import { __dirname } from '../utils.js';
import CarritoManager from '../CarritoManager.js';
import ProductManager from '../ProductManager.js';

const router = Router();
const adminCart = new CarritoManager(join(__dirname, 'data', 'carrito.json'));
const adminProduct = new ProductManager(
  join(__dirname, 'data', 'productList.json')
);

const cartRoutes = () => {
  // Crear carrito
  router.post('/api/carts', async (req, res) => {
    try {
      const cartsAdded = await adminCart.addCart();
      return res.status(200).json(cartsAdded);
    } catch (err) {
      console.log(err);
    }
  });

  // Obtener productos de un carrito
  router.get('/api/carts/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const itemsInCart = await adminCart.getCartProducts(cid);
      if (itemsInCart.msg === "The cart you're looking for not exists")
        return res.status(404).json(itemsInCart);

      return res.status(200).json(itemsInCart);
    } catch (err) {
      console.log(err);
    }
  });

  // Agregar productos al carrito seleccionado
  router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const productExists = await adminProduct.getProduct(pid);
      if (productExists.msg !== "The product you're looking for not exists") {
        const productAddedToCart = await adminCart.addProductToCart(cid, pid);
        if (productAddedToCart.msg === "The cart you're looking for not exists")
          return res.status(404).json(productAddedToCart);

        return res.status(200).json(productAddedToCart);
      } else {
        return res
          .status(404)
          .json({ msg: "The product you're trying to add not exists" });
      }
    } catch (err) {
      console.log(err);
    }
  });

  return router;
};

export default cartRoutes;
