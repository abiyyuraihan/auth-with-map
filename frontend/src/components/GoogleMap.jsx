import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -6.200000,
  lng: 106.816666
};

const libraries = ["places"];

function GoogleMapComponent({ setLocation, setAlamat }) {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);
  const searchBoxRef = useRef(null);

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setLocation({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: event.latLng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setAlamat(results[0].formatted_address);
        }
      }
    });
  }, [setLocation, setAlamat]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onSearchBoxLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    if (place.geometry && place.geometry.location) {
      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setMarkerPosition(newPosition);
      setLocation(newPosition);
      setAlamat(place.formatted_address);
      map.panTo(newPosition);
      map.setZoom(15);
    }
  };

const GOOGLE_API = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_API}
      libraries={libraries}
    >
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <StandaloneSearchBox
          onLoad={onSearchBoxLoad}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Cari lokasi..."
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '240px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipses',
              position: 'absolute',
              left: '50%',
              marginLeft: '-120px',
              top: '10px',
              zIndex: 1
            }}
          />
        </StandaloneSearchBox>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
          onLoad={onLoad}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default React.memo(GoogleMapComponent);