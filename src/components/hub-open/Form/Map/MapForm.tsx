import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { LatLng, LatLngExpression } from 'leaflet';

import * as S from './maps.styles';

const LocationMarkers: React.FC<any> = ({ marker, mapChange }) => {
  const markerRef = useRef(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      mapChange({ lng, lat });
    },
  });
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const mark: any = markerRef.current;
        if (mark) {
          const { lat, lng } = mark.getLatLng();

          // mapChange({ lng, lat });
        }
      },
    }),
    [],
  );

  return (
    <React.Fragment>
      <Marker
        // draggable={true}
        position={new LatLng(marker.latitude, marker.longitude)}
        eventHandlers={eventHandlers}
        ref={markerRef}
      ></Marker>
    </React.Fragment>
  );
};

const MapForm: React.FC<any> = ({ marker, mapChange }) => {
  const { t } = useTranslation();

  return (
    <>
      <S.MapsCard>
        <MapContainer
          center={[marker.latitude, marker.longitude]}
          zoom={2}
          zoomControl={false}
          minZoom={1}
          maxZoom={20}
          style={{ height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarkers marker={marker} mapChange={mapChange} />
        </MapContainer>
      </S.MapsCard>
    </>
  );
};

export default MapForm;
