import axios from "axios";
import { Settings } from "../../config";

const baseUrl = Settings.SERVER_URL;

export class UsersAdapter {
  static async getPickupUsers() {
    try {
      let response = (await axios.get(`${baseUrl}/pricing/pickup-points`)).data;
      // console.log(response);

      const pickupUsers = response.map((user) => ({
        ...user,
        address: user.addresses[0],
      }));
      
      return pickupUsers;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async getUsersByRole(role) {
    try {
      let response = (await axios.get(`${baseUrl}/admin/users-by-role?${role}`))
        .data;
      console.log(response);

      return response;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
  static async getSpecialUsers() {
    try {
      let response = (await axios.get(`${baseUrl}/admin/special-users`)).data;
      // console.log(response);

      return response;
    } catch (error) {
      console.log(error);

      return error;
    }
  }
}
