import axios from "axios";
import { Settings } from "../../config/index";

const baseUrl = Settings.SERVER_URL;

export class LibraryProductsService {


  static async getProducts() {
    const response = await axios.get(baseUrl+"/get");
    const data = response.data;
    return data;
  }

  static async editProducts(id) {
    const response = await axios.get(baseUrl+"/edit");
    const data = response.data;
    return data;
  }





}
