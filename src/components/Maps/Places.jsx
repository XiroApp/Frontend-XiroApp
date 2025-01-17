import { useState, useMemo, useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const libraries = ["places"];

export default function Places({ userAddress, onLocationChange, searchQuery }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBf12D8PazAwJEEv91LJKc3G79zsUBl8pA",
    libraries,
    version: "weekly",
  });

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <Maps
      userAddress={userAddress}
      onLocationChange={onLocationChange}
      searchQuery={searchQuery}
    />
  );
}

function Maps({ userAddress, onLocationChange, searchQuery }) {
  const center = useMemo(() => ({ lat: -32, lng: -68.83 }), []);
  const [selected, setSelected] = useState({
    lat: center.lat,
    lng: center.lng,
    address: searchQuery || "",
  });

  useEffect(() => {
    onLocationChange(selected);
  }, [selected, onLocationChange]);

  useEffect(() => {
    if (searchQuery) {
      const fetchCoordinates = async () => {
        try {
          const results = await getGeocode({ address: searchQuery });
          const { lat, lng } = getLatLng(results[0]);
          setSelected({ lat, lng, address: searchQuery });
        } catch (error) {
          console.error("Error geocoding searchQuery:", error);
        }
      };

      fetchCoordinates();
    }
  }, [searchQuery]);

  const handleDragEnd = async (event) => {
    const position = event.latLng;
    const lat = position.lat();
    const lng = position.lng();

    try {
      const results = await getGeocode({ location: { lat, lng } });
      const address = results[0]?.formatted_address || "Unknown location";
      const newLocation = { lat, lng, address };
      setSelected(newLocation);
      onLocationChange(newLocation);
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
  };

  return (
    <div className="w-[100%] h-[100%]">
      <PlacesAutocomplete
        setSelected={setSelected}
        selected={selected}
      />
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={center}
          defaultZoom={17}
          center={selected || center}
          gestureHandling="greedy"
          disableDefaultUI={true}
        >
          {selected && (
            <AdvancedMarker
              position={{ lat: selected.lat, lng: selected.lng }}
              draggable={true}
              onDragEnd={handleDragEnd}
            />
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
const PlacesAutocomplete = ({ setSelected, selected}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (selected.address) {
      setValue(selected.address, false);
    }
  }, [selected.address, setValue]);

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = getLatLng(results[0]);
      setSelected({ lat, lng, address });
    } catch (error) {
      console.error("Error getting geocode: ", error);
    }
  };

  return (
    <div className="autocomplete-container px-1 py-1 w-full lg:px-3 lg:pb-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Buscar"
        className="autocomplete-input placeholder:text-zinc-400 my-1 focus:outline-none focus:ring-2 focus:ring-[#458552] focus:border-transparent"
      />
      {status === "OK" && (
        <ul className="suggestions-list text-pretty px-2 py-2 flex flex-col gap-1 lg:py-3 lg:px-3 lg:text-lg rounded-b-lg ">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="text-stone-500 cursor-pointer"
            >
              - {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
