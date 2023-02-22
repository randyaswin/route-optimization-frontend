import React, { useCallback, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression, LatLngBounds } from 'leaflet';

import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './maps.styles';
import * as St from '@app/pages/uiComponentsPages//UIComponentsPage.styles';
import MapMarkers from './MapMarkers';
import { useMounted } from '@app/hooks/useMounted';
import { getHub } from '@app/store/slices/hubsSlice';
import { Pagination } from '@app/api/hub.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { Pagination as PagePagination } from '@app/components/common/Pagination/Pagination';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

const HubMaps: React.FC = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const MAP_CENTER: LatLngExpression = [-6.413245, 107.021143];
  const tableData = useAppSelector((state) => state.hubs);
  const { isMounted } = useMounted();
  const dispatch = useAppDispatch();

  const bound = new LatLngBounds(
    tableData.data.map((row) => {
      return [row.latitude, row.longitude];
    }),
  );
  const center = bound.getNorthEast() ? bound.getCenter() : MAP_CENTER;

  const fetch = useCallback(
    (pagination: Pagination, sorter) => {
      dispatch(getHub({ pagination, sorter }));
    },
    [isMounted],
  );

  const ChangeView: any = () => {
    const map = useMap();
    // map.setView({ lng: center.lng, lat: center.lat }, DEFAULT_ZOOM);
    bound.isValid() && map.fitBounds(bound); // <===== Error: Bounds are not valid.
    return null;
  };

  useEffect(() => {
    fetch(initialPagination, {});
  }, [fetch]);

  return (
    <>
      <PageTitle>Hubs Map</PageTitle>
      <PagePagination
        showSizeChanger
        size="small"
        defaultCurrent={tableData.pagination.current}
        total={tableData.pagination.total}
        onChange={(page, pageSize) => {
          fetch({ current: page, pageSize }, {});
        }}
      />
      <S.MapsCard>
        <MapContainer center={center} zoom={18} zoomControl={false} minZoom={1} maxZoom={20} style={{ height: '100%' }}>
          <ChangeView />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapMarkers />
        </MapContainer>
      </S.MapsCard>
    </>
  );
};

export default HubMaps;
