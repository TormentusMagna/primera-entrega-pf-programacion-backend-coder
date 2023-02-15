import { readFile, writeFile } from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  // Get all products
  getProducts = async (limit) => {
    try {
      if (limit !== undefined) {
        this.products = await JSON.parse(await readFile(this.path));
        const filtroQuery = this.products.filter(
          (p) => p.id <= parseInt(limit)
        );
        return filtroQuery;
      } else {
        this.products = await JSON.parse(await readFile(this.path));
        return this.products;
      }
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  };

  // Get a single product
  getProduct = async (pid) => {
    try {
      const allProducts = await JSON.parse(await readFile(this.path));
      const exists = await allProducts.some((p) => p.id === parseInt(pid));
      if (exists) {
        return await allProducts.find((p) => p.id === parseInt(pid));
      } else {
        return { msg: "The product you're looking for not exists" };
      }
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  };

  // Add products
  addProduct = async (productData) => {
    try {
      this.products = await JSON.parse(await readFile(this.path));
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = productData;

      if (
        title === '' ||
        description === '' ||
        code === '' ||
        price === '' ||
        status === '' ||
        stock === '' ||
        category === '' ||
        thumbnails === ''
      ) {
        return {
          msg: 'All fields are required. Fill all data and try again',
        };
      } else {
        const newProductData = {
          id: this.products.length + 1,
          title,
          description,
          code,
          price: Number(price),
          status: Boolean(status),
          stock: Number(stock),
          category,
          thumbnails: Array(thumbnails),
        };
        this.products.push(newProductData);

        const newProduct = JSON.stringify(this.products);
        await writeFile(this.path, newProduct);
        return { msg: 'The product was added successfully' };
      }
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  };

  // Update a product
  updateProduct = async (pid, dataToUpdate) => {
    try {
      const allProducts = await JSON.parse(await readFile(this.path));
      const exists = await allProducts.some((p) => p.id === parseInt(pid));
      if (exists) {
        this.products = await allProducts.map((p) =>
          p.id === parseInt(pid) ? { ...p, ...dataToUpdate } : p
        );
        const data = JSON.stringify(this.products);
        await writeFile(this.path, data);
        return { msg: 'The product was updated successfully' };
      } else {
        return { msg: "The product you're looking for not exists" };
      }
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  };

  // Delete a product
  deleteProduct = async (pid) => {
    try {
      const allProducts = await JSON.parse(await readFile(this.path));
      const exists = await allProducts.some((p) => p.id === parseInt(pid));
      if (exists) {
        this.products = await allProducts.filter((p) => p.id !== parseInt(pid));
        const data = JSON.stringify(this.products);
        await writeFile(this.path, data);
        return { msg: 'The product was deleted successfully' };
      } else {
        return { msg: "The product you're looking for not exists" };
      }
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  };
}

export default ProductManager;
