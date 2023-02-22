import { createAction, createAsyncThunk, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { Hub, ListHubs, Pagination, Sort } from '@app/api/hub.api';

const initialState: Hub = {
  id: 0,
  hubid: '',
  name: '',
  address: '',
  open: '',
  close: '',
  longitude: 0,
  latitude: 0,
  status: '',
};

export const setActiveHub = createAction<PrepareAction<Hub>>('hubactive/setHub', (hub: Hub) => {
  return {
    payload: hub,
  };
});

export const activeHubSlice = createSlice({
  name: 'hubactive',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setActiveHub, (state, action) => {
      state.id = action.payload.id;
      state.hubid = action.payload.hubid;
      state.name = action.payload.name;
      state.address = action.payload.address;
      state.open = action.payload.open;
      state.close = action.payload.close;
      state.longitude = action.payload.longitude;
      state.latitude = action.payload.latitude;
      state.status = action.payload.status;
    });
  },
});

export default activeHubSlice.reducer;
