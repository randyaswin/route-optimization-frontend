import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import React, { Component, useCallback, useState } from 'react';

import { Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Descriptions } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import * as S from '@app/pages/uiComponentsPages//UIComponentsPage.styles';
import * as SMap from './maps.styles';
import VisitMarkerPopup from './VisitMarkerPopup';
import HubMarkerPopup from './HubMarkerPopup';

const MapMarkers: React.FC<any> = () => {
  const visitesData = useAppSelector((state) => state.visites);
  const hubsData = useAppSelector((state) => state.hubs);

  return (
    <>
      {hubsData.data.map((row, index) => (
        <HubMarkerPopup row={row} key={row.id} />
      ))}
      {/* <MarkerClusterGroup chunkedLoading> */}
      {visitesData.data.map((row, index) => (
        <VisitMarkerPopup row={row} key={row.id} />
      ))}
      {/* </MarkerClusterGroup> */}
    </>
  );
};

export default MapMarkers;
