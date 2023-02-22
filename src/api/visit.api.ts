import { Priority } from '../constants/enums/priorities';
import { httpApi } from '@app/api/http.api';
import { stringify } from 'query-string';
import { Dictionary } from '@reduxjs/toolkit';

export interface Tag {
  value: string;
  priority: Priority;
}

export interface VisitCreate {
  visitid: string;
  name: string;
  address: string;
  open: string;
  close: string;
  demand: number;
  service_time: number;
  longitude: number;
  latitude: number;
  hub_id: number;
}

export interface VisitUpdate extends VisitCreate {
  active?: boolean;
}

export interface Visit extends VisitUpdate {
  id: number;
  vehicle_id?: number;
  datang?: string;
  berangkat?: string;
  driving_distance?: number;
  driving_time?: number;
  seq_sales?: number;
}

export interface Geometry {
  type: string;
  coordinates: [];
}

export interface VisitFeature {
  type: string;
  geometry: Geometry;
  properties: Visit;
}

export interface VisitFeatureCollection {
  type: string;
  features: VisitFeature[];
}

export interface VisitFeatureCollectionResponse {
  type: string;
  features: VisitFeature[];
  pagination: Pagination;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
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

export interface Filter {
  [key: string]: any;
}

export const ListVisites = (
  pagination: Pagination,
  sort: Sort,
  filter?: Filter,
): Promise<VisitFeatureCollectionResponse> => {
  const rangeStart =
    ((pagination.current ? pagination.current : 1) - 1) * (pagination.pageSize ? pagination.pageSize : 10);
  const rangeEnd = (pagination.current ? pagination.current : 1) * (pagination.pageSize ? pagination.pageSize : 10) - 1;
  const query = {
    sort: JSON.stringify(['id', 'ASC']),
    range: JSON.stringify([rangeStart, rangeEnd]),
    filter: JSON.stringify(false),
  };
  if (sort.field) {
    query.sort = JSON.stringify([
      sort.field,
      sort.order === 'ascend' ? 'ASC' : sort.order === 'descend' ? 'DESC' : 'ASC',
    ]);
  }

  if (filter) {
    if (Object.keys(filter).length > 0) {
      query.filter = JSON.stringify([Object.keys(filter)[0], filter[Object.keys(filter)[0]]]);
    }
  }

  return httpApi
    .get<VisitFeatureCollection>(`visites?${stringify(query)}`, {
      headers: { Range: `hub=${rangeStart}-${rangeEnd}` },
    })
    .then(({ headers, data }) => {
      return {
        type: 'FeatureCollection',
        features: data.features,
        pagination: { ...pagination, total: parseInt(headers['content-range'].split('/')[1], 10) },
      };
    });
};

export const DeleteVisit = (id: number): Promise<Message> => {
  return httpApi.delete<Message>(`visites/${id}`).then(({ data }) => data);
};

export const EditVisites = (id: number, data: VisitUpdate): Promise<Message> => {
  return httpApi
    .put<Message>(`visites/${id}`, data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(({ headers, data }) => data);
};

export const AddVisit = (data: VisitCreate): Promise<Message> => {
  return httpApi
    .post<Message>(`visites`, data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(({ headers, data }) => data);
};

export const UploadVisites = (file: Blob): Promise<FullMessage> => {
  const formData = new FormData();
  formData.append('file', file);
  return httpApi
    .post<FullMessage>(`upload/hub`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(({ headers, data }) => data);
};
