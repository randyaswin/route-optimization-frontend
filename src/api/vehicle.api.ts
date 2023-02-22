import { Priority } from '../constants/enums/priorities';
import { httpApi } from '@app/api/http.api';
import { stringify } from 'query-string';

export interface Tag {
  value: string;
  priority: Priority;
}

export interface VehicleCreate {
  vehicleid: string;
  name: string;
  start: string;
  end: string;
  capacity: number;
  distance: number;
  work_time: number;
  hub_id: number;
}

export interface VehicleUpdate extends VehicleCreate {
  active?: boolean;
}

export interface Vehicle extends VehicleUpdate {
  id: number;
  total_load?: number;
  total_distance?: number;
  total_time?: number;
  used?: number;
}

export interface VehicleResponse {
  data: Vehicle[];
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

export const ListVehicles = (pagination: Pagination, sort: Sort): Promise<VehicleResponse> => {
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
    .get<Vehicle[]>(`vehicles?${stringify(query)}`, {
      headers: { Range: `hub=${rangeStart}-${rangeEnd}` },
    })
    .then(({ headers, data }) => {
      return {
        data: data,
        pagination: { ...pagination, total: parseInt(headers['content-range'].split('/')[1], 10) },
      };
    });
};

export const DeleteVehicle = (id: number): Promise<Message> => {
  return httpApi.delete<Message>(`vehicles/${id}`).then(({ data }) => data);
};

export const EditVehicles = (id: number, data: VehicleCreate): Promise<Message> => {
  return httpApi
    .put<Message>(`vehicles/${id}`, data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(({ headers, data }) => data);
};

export const AddVehicle = (data: VehicleCreate): Promise<Message> => {
  return httpApi
    .post<Message>(`vehicles`, data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(({ headers, data }) => data);
};

export const UploadVehicles = (file: Blob): Promise<FullMessage> => {
  const formData = new FormData();
  formData.append('file', file);
  return httpApi
    .post<FullMessage>(`upload/hub`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(({ headers, data }) => data);
};
