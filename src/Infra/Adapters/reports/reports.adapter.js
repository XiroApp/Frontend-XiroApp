import axios from "axios";
import { Settings } from "../../config/index";

const baseUrl = Settings.SERVER_URL;

export class ReportsAdapter {

  static async setBatchToDelivery(batch, uidDelivery) {
    let { data } = await axios.post(`${baseUrl}/batch`, { batch, uidDelivery });
    console.log(data);
  }
}
