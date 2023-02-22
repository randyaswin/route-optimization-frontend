import { createAction, createAsyncThunk, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { Vehicle, ListVehicles, Pagination, Sort } from '@app/api/vehicle.api';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

export interface VehicleState {
  data: Vehicle[];
  pagination: Pagination;
  loading: boolean;
  sorter: Sort;
}

export interface TableState {
  pagination: Pagination;
  sorter: Sort;
}

const initialState: VehicleState = {
  data: [],
  pagination: initialPagination,
  loading: false,
  sorter: {},
};

export const setVehicleLoading = createAction<PrepareAction<boolean>>('vehicle/setLoading', (loading: boolean) => {
  return {
    payload: loading,
  };
});

export const getVehicle = createAsyncThunk('vehicle/getVehicle', async (pagination: TableState, { dispatch }) => {
  dispatch(setVehicleLoading(true));
  return ListVehicles(pagination.pagination, pagination.sorter).then((res) => {
    return {
      data: res.data.map((row) => row),
      pagination: res.pagination,
      loading: false,
      sorter: pagination.sorter,
    };
  });
});

export const setVehicle = createAction<PrepareAction<any>>('vehicle/setVehicle', (vehicle: Vehicle) => {
  return {
    payload: vehicle,
  };
});

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVehicle.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = action.payload.loading;
      state.sorter = action.payload.sorter;
    });
    builder.addCase(setVehicleLoading, (state, action) => {
      state.loading = action.payload;
    });
    builder.addCase(setVehicle, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default vehicleSlice.reducer;
