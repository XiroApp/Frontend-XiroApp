import axios from "axios";
import { Settings } from "../../config";

const url = Settings.SERVER_URL;

export class InAppTextsService {
  static async getLabels() {
    const response = (await axios.get(`${url}/labels/labels_array`)).data;
    return response;
  }

  static async editLabels(body) {
    const response = (await axios.put(`${url}/labels`, body)).data;
    return response;
  }

  static async getTyCLabel() {
    const response = (await axios.get(`${url}/labels/tyc`)).data;
    return response;
  }

  static async updateTyCLabel(html) {
    const response = (await axios.put(`${url}/labels/tyc`, { tyc_html: html }))
      .data;
    return response;
  }
}
