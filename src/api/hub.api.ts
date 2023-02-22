import { Priority } from '../constants/enums/priorities';
import { httpApi } from '@app/api/http.api';
import { stringify } from 'query-string';
import { Visit } from './visit.api';
import { Vehicle } from './vehicle.api';

export interface Tag {
  value: string;
  priority: Priority;
}

export interface BasicTableRow {
  key: number;
  name: string;
  age: number;
  address: string;
  tags?: Tag[];
}

export interface HubCreate {
  hubid: string;
  name: string;
  address: string;
  open: string;
  close: string;
  longitude: number;
  latitude: number;
}

export interface HubUpdate extends HubCreate {
  status: string;
}

export interface Hub extends HubUpdate {
  id: number;
  visites?: Visit;
  vehicles?: Vehicle;
}

export interface Geometry {
  type: string;
  coordinates: [];
}

export interface HubFeature {
  type: string;
  geometry: Geometry;
  properties: Hub;
}

export interface HubFeatureCollection {
  type: string;
  features: HubFeature[];
}

export interface HubFeatureCollectionResponse {
  type: string;
  features: HubFeature[];
  pagination: Pagination;
}

export interface HubResponse {
  data: Hub[];
  pagination: Pagination;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface BasicTableData {
  data: BasicTableRow[];
  pagination: Pagination;
}

export interface TreeTableRow extends BasicTableRow {
  children?: TreeTableRow[];
}

export interface TreeTableData extends BasicTableData {
  data: TreeTableRow[];
}

export interface EditableTableData extends BasicTableData {
  data: BasicTableRow[];
}

export interface Message {
  succcess: boolean;
}

export interface FullMessage {
  message: string;
}

export interface Sort {
  column?: any;
  columnKey?: string;
  order?: string;
  field?: string;
}

export const ListHubs = (pagination: Pagination, sort: Sort): Promise<HubResponse> => {
  const rangeStart =
    ((pagination.current ? pagination.current : 1) - 1) * (pagination.pageSize ? pagination.pageSize : 10);
  const rangeEnd = (pagination.current ? pagination.current : 1) * (pagination.pageSize ? pagination.pageSize : 10) - 1;
  const query = {
    sort: JSON.stringify(['id', 'ASC']),
    range: JSON.stringify([rangeStart, rangeEnd]),
    // filter: JSON.stringify(params.filter),
  };
  if (sort.field) {
    query.sort = JSON.stringify([
      sort.field,
      sort.order === 'ascend' ? 'ASC' : sort.order === 'descend' ? 'DESC' : 'ASC',
    ]);
  }

  return httpApi
    .get<Hub[]>(`hubs?${stringify(query)}`, {
      headers: { Range: `hub=${rangeStart}-${rangeEnd}` },
    })
    .then(({ headers, data }) => {
      return {
        data: data,
        pagination: { ...pagination, total: parseInt(headers['content-range'].split('/')[1], 10) },
      };
    });
};

export const openHub = (id: number): Promise<Hub> => {
  return httpApi.get<Hub>(`hubs/${id}`).then(({ headers, data }) => {
    return {
      ...data,
    };
  });
};

export const DeleteHub = (id: number): Promise<Message> => {
  return httpApi.delete<Message>(`hubs/${id}`).then(({ data }) => data);
};

export const EditHubs = (id: number, data: HubCreate): Promise<Message> => {
  return httpApi
    .put<Message>(`hubs/${id}`, data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(({ headers, data }) => data);
};

export const AddHub = (data: HubCreate): Promise<Message> => {
  return httpApi
    .post<Message>(`hubs`, data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(({ headers, data }) => data);
};

export const UploadHubs = (file: Blob): Promise<FullMessage> => {
  const formData = new FormData();
  formData.append('file', file);
  return httpApi
    .post<FullMessage>(`upload/hub`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(({ headers, data }) => data);
};

export const UploadHubVehicle = (file: Blob, hub_id: number): Promise<FullMessage> => {
  const formData = new FormData();
  formData.append('file', file);
  return httpApi
    .post<FullMessage>(`upload/hub/${hub_id}/vehicle`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(({ headers, data }) => data);
};

export const UploadHubVisit = (file: Blob, hub_id: number): Promise<FullMessage> => {
  const formData = new FormData();
  formData.append('file', file);
  return httpApi
    .post<FullMessage>(`upload/hub/${hub_id}/visit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(({ headers, data }) => data);
};
