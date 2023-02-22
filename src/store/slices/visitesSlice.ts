import { createAction, createAsyncThunk, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { Visit, ListVisites, Pagination, Sort } from '@app/api/visit.api';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 10,
};

export interface VisitState {
  data: Visit[];
  pagination: Pagination;
  loading: boolean;
  sorter: Sort;
  filter?: any;
}

export interface TableState {
  pagination: Pagination;
  sorter: Sort;
  filter?: any;
}

const initialState: VisitState = {
  data: [],
  pagination: initialPagination,
  loading: false,
  sorter: {},
  filter: {},
};

export const setVisitLoading = createAction<PrepareAction<boolean>>('visit/setLoading', (loading: boolean) => {
  return {
    payload: loading,
  };
});

export const getVisit = createAsyncThunk('visit/getVisit', async (pagination: TableState, { dispatch }) => {
  dispatch(setVisitLoading(true));
  return ListVisites(pagination.pagination, pagination.sorter, pagination.filter).then((res) => {
    return {
      data: res.features.map((row) => row.properties),
      pagination: res.pagination,
      loading: false,
      sorter: pagination.sorter,
      filter: pagination.filter,
    };
  });
});

export const setVisit = createAction<PrepareAction<any>>('visit/setVisit', (visit: Visit) => {
  return {
    payload: visit,
  };
});

export const visitSlice = createSlice({
  name: 'visit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVisit.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = action.payload.loading;
      state.sorter = action.payload.sorter;
      state.filter = action.payload.filter;
    });
    builder.addCase(setVisitLoading, (state, action) => {
      state.loading = action.payload;
    });
    builder.addCase(setVisit, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default visitSlice.reducer;
