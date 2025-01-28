import { useState, useMemo, useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const libraries = ["places"];

const points = [
  { lat: -32.89084, lng: -68.82717 },
  { lat: -32.891, lng: -68.81717 },
  { lat: -32.891, lng: -68.85717 },
];

const DeliveryRoutes = () => {
  return (
    <section className="w-full text-balance flex flex-col justify-center items-center pt-2 lg:flex-row lg:items-start lg:pt-4">
      <article className="flex flex-col pl-3 text-stone-500 text-base md:pl-4 md:text-lg">
        <h6 className="text-xl lg:text-2xl">Rutas Inteligentes</h6>
        <p className="text-stone-400 mt-1 lg:mt-2">
          <span className="text-stone-500">Planifica tus entregas</span> :
          Accede de manera rápida y sencilla a las rutas asignadas
        </p>
        <ul className="text-stone-500 mt-4 flex flex-col gap-2 lg:mt-6">
          <li>Pedido 1:</li>
          <li>Pedido 2:</li>
          <li>Pedido 3:</li>
          <li>Pedido 4:</li>
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
    libraries: ["places"],
    version: "weekly",
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Maps />;
};

function Maps() {
  const defaultCenter = { lat: -32.89084, lng: -68.82717 };

  return (
    <div className="w-[100%] h-[100%] max-w-[800px] ">
      <APIProvider>
        <Map
          mapId="DEMO_MAP_ID"
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI={true}
          defaultCenter={defaultCenter}
        >
          {points?.map((point, i) => (
            <AdvancedMarker
              position={point ? point : defaultCenter}
              draggable={true}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
