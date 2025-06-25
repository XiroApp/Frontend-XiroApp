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

  static async getUsersPaginated(
    limit,
    startAfterValue,
    endBeforeValue,
    status_filter,
    role,
    uid
  ) {
    try {
      // let response = await axios.get(`${baseUrl}/admin/users/paginated`);
      console.log("en el adapter");
      console.log("limit => ", limit);
      console.log("startAfterValue => ", startAfterValue);
      console.log("endBeforeValue => ", endBeforeValue);
      console.log("status_filter => ", status_filter);
      console.log("role => ", role);
      console.log("uid => ", uid);

      let url = "";

      if (uid) {
        url = `${baseUrl}/admin/users/paginated/${uid}?limit=${limit}&status=${status_filter}`; // Usamos el estado 'limit'
        if (startAfterValue !== null) {
          // Si vamos a la siguiente página, añadimos startAfter
          url += `&startAfter=${startAfterValue}`;
        } else if (endBeforeValue !== null) {
          // Si vamos a la página anterior, añadimos endBefore
          url += `&endBefore=${endBeforeValue}`;
        }
      } else {
        url = `${baseUrl}/admin/users/paginated?limit=${limit}&status=${status_filter}`; // Usamos el estado 'limit'
        if (startAfterValue !== null) {
          // Si vamos a la siguiente página, añadimos startAfter
          url += `&startAfter=${startAfterValue}`;
        } else if (endBeforeValue !== null) {
          // Si vamos a la página anterior, añadimos endBefore
          url += `&endBefore=${endBeforeValue}`;
        }
      }
      console.log("url => ", url);
      const response = await axios.get(url);

      const data = response.data;
      console.log("data => ", data);
      return { ...data };
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
