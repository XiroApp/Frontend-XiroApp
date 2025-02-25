import { LibraryProductsService } from "../Services/library_products.service";

export class LibraryProductsAdapter {
  static async getProducts() {
    const response = await LibraryProductsService.getProducts();

    const product = {
      name: response.name,
    };

    return product;
  }

  static async editProducts() {
    const response = await axios.get(baseUrl + "/edit");
    const data = response.data;
    return data;
  }
}
