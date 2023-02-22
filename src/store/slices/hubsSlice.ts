import { createAction, createAsyncThunk, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { Hub, ListHubs, Pagination, Sort, openHub } from '@app/api/hub.api';
import { setVisit } from './visitesSlice';
import { setVehicle } from './vehiclesSlice';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

export interface HubState {
  data: Hub[];
  pagination: Pagination;
  loading: boolean;
  sorter: Sort;
}

export interface TableState {
  pagination: Pagination;
  sorter: Sort;
}

const initialState: HubState = {
  data: [],
  pagination: initialPagination,
  loading: false,
  sorter: {},
};

export const setHubLoading = createAction<PrepareAction<boolean>>('hub/setLoading', (loading: boolean) => {
  return {
    payload: loading,
  };
});

export const getHub = createAsyncThunk('hub/getHub', async (pagination: TableState, { dispatch }) => {
  dispatch(setHubLoading(true));
  return ListHubs(pagination.pagination, pagination.sorter).then((res) => {
    console.log(res);
    return {
      data: res.data,
      pagination: res.pagination,
      loading: false,
      sorter: pagination.sorter,
    };
  });
});

export const getOpenHub = createAsyncThunk('hub/getOpenHub', async (id: string, { dispatch }) => {
  dispatch(setHubLoading(true));
  return openHub(parseInt(id)).then((res) => {
    dispatch(setVisit(res.visites));
    dispatch(setVehicle(res.vehicles));
    dispatch(setHubLoading(true));
    return {
      data: [res],
    };
  });
});

export const hubSlice = createSlice({
  name: 'hub',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHub.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = action.payload.loading;
      state.sorter = action.payload.sorter;
    });
    builder.addCase(getOpenHub.fulfilled, (state, action) => {
      state.data = action.payload.data;
    });
    builder.addCase(setHubLoading, (state, action) => {
      state.loading = action.payload;
    });
  },
});

export default hubSlice.reducer;
