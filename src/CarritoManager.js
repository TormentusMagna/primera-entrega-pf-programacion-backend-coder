import { readFile, writeFile } from 'fs/promises';

class CarritoManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.products = [];
  }

  // Agregar carrito
  addCart = async () => {
    try {
      this.carts = await JSON.parse(await readFile(this.path));

      const newCart = {
        id: this.carts.length + 1,
        products: this.products,
      };
      this.carts.push(newCart);

      const data = JSON.stringify(this.carts);
      await writeFile(this.path, data);
      return { msg: 'New cart created successfully' };
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  };

  // Pedir productos de un carrito específico
  getCartProducts = async (cid) => {
    try {
      this.carts = await JSON.parse(await readFile(this.path));
      const exists = this.carts.some((p) => p.id === parseInt(cid));

      if (exists) {
        const cartSelected = await this.carts.find(
          (p) => p.id === parseInt(cid)
        );
        return cartSelected.products;
      } else {
        return { msg: "The cart you're looking for not exists" };
      }
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  };

  // Agregar productos al carrito
  addProductToCart = async (cid, pid) => {
    try {
      this.carts = await JSON.parse(await readFile(this.path));
      const cartExists = this.carts.some((p) => p.id === parseInt(cid));

      if (cartExists) {
        const cartSelected = await this.carts.find(
          (p) => p.id === parseInt(cid)
        );
        const productAlreadyInCart = await cartSelected.products.some(
          (p) => p.product === parseInt(pid)
        );

        if (productAlreadyInCart) {
          const productQuantity = await cartSelected.products.find(
            (p) => p.product === parseInt(pid)
          );

          const productModified = {
            product: parseInt(pid),
            quantity: productQuantity.quantity + 1,
          };

          const addQuantity = await cartSelected.products.map((p) =>
            p.product === parseInt(pid) ? { ...p, ...productModified } : p
          );
          cartSelected.products = addQuantity;

          const update = this.carts.map((p) =>
            p.id === parseInt(cid) ? { ...cartSelected } : p
          );

          const data = JSON.stringify(update);
          await writeFile(this.path, data);
          return { msg: 'Success. The quantity of the order was modified' };
        } else {
          const productModified = {
            product: parseInt(pid),
            quantity: 1,
          };

          const cartSelected = await this.carts.find(
            (p) => p.id === parseInt(cid)
          );
          await cartSelected.products.push(productModified);

          const update = this.carts.map((p) =>
            p.id === parseInt(cid) ? { ...cartSelected } : p
          );

          const data = JSON.stringify(update);
          await writeFile(this.path, data);
          return {
            msg: 'Success. The product was added to products array in the cart selected',
          };
        }
      } else {
        return { msg: "The cart you're looking for not exists" };
      }
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  };
}

export default CarritoManager;
