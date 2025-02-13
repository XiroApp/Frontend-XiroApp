import { useState, useEffect } from "react";
import {
  useLoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";

const libraries = ["places"];

const points = [
  { lat: -32.89084, lng: -68.82717 },
  { lat: -32.891, lng: -68.81717 },
  { lat: -32.891, lng: -68.85717 },
];

const DeliveryRoutes = () => {
  const orders = useSelector((state) => state.orders);

  useEffect(() => {}, []);

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
        <RoutesDelivery />
      </div>
    </section>
  );
};

export default DeliveryRoutes;

const RoutesDelivery = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBf12D8PazAwJEEv91LJKc3G79zsUBl8pA",
    libraries: libraries,
    version: "weekly",
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Maps isLoaded={isLoaded} />;
};

function Maps({ isLoaded }) {
  const defaultCenter = { lat: -32.89084, lng: -68.82717 };
  const [directions, setDirections] = useState(null);

  const calculateDirections = async () => {
    if (points.length > 1) {
      const directionService = new window.google.maps.DirectionsService();

      const waypoints = points.slice(1, -1).map((point) => ({
        location: { lat: point.lat, lng: point.lng },
        stopover: true,
      }));

      const request = {
        origin: points[0],
        destination: points[points.length - 1],
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

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
