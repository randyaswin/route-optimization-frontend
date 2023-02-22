import React, { useCallback, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression, LatLngBounds } from 'leaflet';

import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './maps.styles';
import * as St from '@app/pages/uiComponentsPages//UIComponentsPage.styles';
import MapMarkers from './MapMarkers';
import { useMounted } from '@app/hooks/useMounted';
import { getVisit } from '@app/store/slices/visitesSlice';
import { Pagination } from '@app/api/visit.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { Pagination as PagePagination } from '@app/components/common/Pagination/Pagination';
import { FilterForm } from '../Form/FilterForm';
import Row from 'antd/lib/row';
import { Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { Button } from '@app/components/common/buttons/Button/Button';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

const VisitMaps: React.FC = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const MAP_CENTER: LatLngExpression = [-6.413245, 107.021143];
  const tableData = useAppSelector((state) => state.visites);
  const { isMounted } = useMounted();
  const dispatch = useAppDispatch();

  const bound = new LatLngBounds(
    tableData.data.map((row) => {
      return [row.latitude, row.longitude];
    }),
  );
  const center = bound.getNorthEast() ? bound.getCenter() : MAP_CENTER;

  const fetch = useCallback(
    (pagination: Pagination, sorter, filter?) => {
      dispatch(getVisit({ pagination, sorter, filter }));
    },
    [isMounted],
  );

  const ChangeView: any = () => {
    const map = useMap();
    // map.setView({ lng: center.lng, lat: center.lat }, DEFAULT_ZOOM);
    bound.isValid() && map.fitBounds(bound); // <===== Error: Bounds are not valid.
    return null;
  };

  const onFilter = (value: any) => {
    fetch(tableData.pagination, tableData.sorter, value);
  };

  useEffect(() => {
    fetch(initialPagination, {}, {});
  }, [fetch]);

  return (
    <>
      <PageTitle>Visites Map</PageTitle>
      <Row>
        <Col>
          <Dropdown
            overlay={<FilterForm style={{ width: 100 }} onFilter={(v: any) => onFilter(v)} />}
            trigger={['click']}
            overlayStyle={{ backgroundColor: 'var(--background-color)' }}
          >
            <Button size="small" onClick={(e) => e.preventDefault()}>
              Filter <DownOutlined />
            </Button>
          </Dropdown>
        </Col>

        <Col flex="auto" />
        <Col>
          <PagePagination
            showSizeChanger
            size="small"
            defaultCurrent={tableData.pagination.current}
            total={tableData.pagination.total}
            onChange={(page, pageSize) => {
              fetch({ current: page, pageSize }, {}, tableData.filter);
            }}
          />
        </Col>
      </Row>
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

export default VisitMaps;
