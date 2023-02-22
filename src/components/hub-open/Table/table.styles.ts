import styled from 'styled-components';
import { Card } from '@app/components/common/Card/Card';
import { Popup } from 'react-leaflet';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Descriptions } from 'antd';
import { Table } from '@app/components/common/Table/Table';

interface CardInternalProps {
  $padding: string | number | [number, number];
  $autoHeight: boolean;
}

export const sDescription = styled(Descriptions)`
  background-color: var(--background-color);

  .ant-descriptions-item-label {
    color: var(--primary-color);
  }
`;

export const sTable = styled(Table)`
  tr.ant-table-expanded-row:hover > td,
  tr.ant-table-expanded-row > td {
    background: var(--background-color);
  }
  .ant-descriptions-bordered .ant-descriptions-item-label {
    background-color: var(--background-color);
  }
`;
export const EditButton = styled(Button)`
  font-size: 11px;
`;

export const DropdownCard = styled(Card)`
  margin-bottom: 0rem;
`;

export const MapsCard = styled(Card)`
  height: 70vh;

  .leaflet-container {
    z-index: 0;
  }
`;

export const StyledPop = styled(Popup)`
  background-color: var(--background-color);
  .leaflet-container {
    font: 12px/1.5 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 0;
  }

  .leaflet-popup-tip-container {
    visibility: hidden;
  }
  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: var(--background-color);
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  }
  .leaflet-popup-content {
    margin: 0px 0px;
    line-height: 1.4;
  }
  margin-bottom: 1.25rem;
  .ant-card-head-title {
    font-size: 1rem;
  }
  .ant-card-body {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    align-items: center;
  }
  .ant-card-body:before {
    display: none;
  }
  .ant-card-body:after {
    display: none;
  }
  &.ant-card-bordered {
    border: 1px solid var(--border-color);
  }
  .ant-descriptions-item-label {
    color: var(--primary-color);
    font-weight: 400;
    font-size: 11px;
    line-height: 1.5715;
    text-align: start;
  }
  .ant-descriptions-bordered .ant-descriptions-item-label {
    background-color: var(--background-color);
  }
  .ant-descriptions-item-content,
  .ant-divider {
    color: var(--text-main-color);
    font-size: 11px;
    line-height: 1.5715;
  }
  .ant-descriptions-title {
    flex: auto;
    overflow: hidden;
    color: var(--heading-color);
    font-weight: 700;
    font-size: 12px;
    line-height: 1.5715;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
