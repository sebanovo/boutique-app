import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const MapaUbicacion = ({ setLa, setLo }) => {
  const [ubicacion, setUbicacion] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDROV7Q2awH92CRumj3WD31iUd4HrNh4Ow"
  });

  // 📍 Obtener ubicación del dispositivo al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUbicacion(coords);
          setLa(coords.lat);
          setLo(coords.lng);
        },
        (err) => console.error("Error al obtener ubicación:", err)
      );
    }
  }, [setLa, setLo]);

  // 📍 Actualizar ubicación al hacer click en el mapa
  const handleMapaClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setUbicacion(coords);
    setLa(coords.lat);
    setLo(coords.lng);
  };

  return (
    <div>
      {isLoaded && ubicacion ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={ubicacion}
          zoom={15}
          onClick={handleMapaClick}
        >
          <Marker position={ubicacion} />
        </GoogleMap>
      ) : (
        <p>Cargando mapa...</p>
      )}

    </div>
  );
};

export default React.memo(MapaUbicacion);
