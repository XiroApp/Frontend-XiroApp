import { useState, useEffect } from "react";
import {
  useLoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";
import axios from "axios";
import { Settings } from "../../../config";
const baseUrl = Settings.SERVER_URL;
const libraries = ["places"];

// const points = [
//   { lat: -32.89084, lng: -68.82717 },
//   { lat: -32.891, lng: -68.81717 },
//   { lat: -32.891, lng: -68.85717 },
// ];

const DeliveryRoutes = () => {
  // const orders = useSelector((state) => state.orders);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState({});
  const user = useSelector(state => state.loggedUser);

  useEffect(() => {
    if (orders.length) {
      console.log(orders[0].distributionUser.addresses[0]);

      const newPoints = orders.map(order => {
        return { lat: order.place.address.lat, lng: order.place.address.lng };
      });
      setPoints({
        waypoints: newPoints,
        origin: {
          lat: orders[0]?.distributionUser?.addresses[0].lat,
          lng: orders[0]?.distributionUser?.addresses[0].lng,
        },
      });
    } else {
      fetchOrders();
    }
  }, []);

  useEffect(() => {
    console.log(orders[0]?.distributionUser?.addresses[0]);

    const newPoints = orders.map(order => {
      return { lat: order.place.address.lat, lng: order.place.address.lng };
    });
    setPoints({
      waypoints: newPoints,
      origin: {
        lat: orders[0]?.distributionUser?.addresses[0].lat,
        lng: orders[0]?.distributionUser?.addresses[0].lng,
      },
    });
  }, [orders]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let response = await axios.get(`${baseUrl}/delivery/orders/${user.uid}`);

      let formatedOrders = response.data
        .map(order => {
          const fechaStr = order.paymentData.date_created;
          const fecha = new Date(fechaStr);

          const dia = fecha.getDate().toString().padStart(2, "0");
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
          const año = fecha.getFullYear();
          const fechaFormateada = `${dia}/${mes}/${año}`;

          return {
            uid: order.uid,
            orderStatus: order.orderStatus,
            order_number: order.order_number,
            cart: order.cart,
            paymentId: order.paymentData.id,
            paymentStatus: order.paymentData.status,
            transactionAmount:
              order.paymentData.transaction_details.total_paid_amount,
            statusDetail: order.paymentData.status_detail,
            clientUid: order.clientUid,
            uidPrinting: order.uidPrinting,
            uidDelivery: order.uidDelivery,
            uidDistribution: order.uidDistribution,
            uidPickup: order.uidPickup,
            deliveryUser: order.deliveryUser,
            distributionUser: order.distributionUser,
            pickupUser: order.pickupUser,
            printingUser: order.printingUser,
            clientUser: order.clientUser,
            report: order.report,
            createdAt: fechaFormateada,
            place: order.place,
          };
        })
        .reverse();
      setOrders(formatedOrders);
    } catch (error) {
      console.log(error);

      return error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full text-balance flex flex-col justify-center items-center pt-2 lg:flex-row lg:items-start lg:pt-4">
      <article className="flex flex-col pl-3 text-stone-500 text-base md:pl-4 md:text-lg">
        <h6 className="text-xl lg:text-2xl">Rutas Inteligentes</h6>
        <p className="text-stone-400 mt-1 lg:mt-2">
          <span className="text-stone-500">Planifica tus entregas</span> :
          Accede de manera rápida y sencilla a las rutas asignadas
        </p>
        <ul className="text-stone-500 mt-4 flex flex-col gap-2 lg:mt-6">
          {orders?.map((order, i) => (
            <li key={i} className="text-stone-400">
              Pedido {i + 1} :{" "}
              <span>
                {`${order?.place?.address.name} ${order?.place?.address.number} ${order?.place?.address.locality}`}
              </span>
            </li>
          ))}
        </ul>
      </article>

      <div className="w-full h-[400px] mt-8 lg:mt-12">
        {points?.waypoints?.length ? <RoutesDelivery points={points} /> : null}
      </div>
    </section>
  );
};

export default DeliveryRoutes;

const RoutesDelivery = ({ points }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBf12D8PazAwJEEv91LJKc3G79zsUBl8pA",
    libraries: libraries,
    version: "weekly",
  });

  if (!isLoaded) return <p>Cargando...</p>;
  return <Maps isLoaded={isLoaded} points={points} />;
};

function Maps({ isLoaded, points }) {
  const defaultCenter = { lat: -32.89084, lng: -68.82717 };
  const [directions, setDirections] = useState(null);

  const calculateDirections = async () => {
    console.log(points);

    if (points) {
      const directionService = new window.google.maps.DirectionsService();

      const waypoints = points?.waypoints?.map(point => ({
        location: { lat: point.lat, lng: point.lng },
        stopover: true,
      }));
      console.log(points.origin);
      console.log(points.waypoints);

      const request = {
        origin: points.origin,
        destination: points.waypoints[points.waypoints.length - 1],
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      console.log(request);

      try {
        const res = await directionService.route(request);
        console.log("Directions Response:", res);
        if (res.status === "OK") {
          setDirections(res);
        }
      } catch (error) {
        console.error("Error calculating directions:", error);
      }
    }
  };

  useEffect(() => {
    if (isLoaded) {
      calculateDirections();
    }
  }, [isLoaded]);

  return (
    <div className="w-[100%] h-[100%] max-w-[800px]">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={13}
        center={defaultCenter}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
}
