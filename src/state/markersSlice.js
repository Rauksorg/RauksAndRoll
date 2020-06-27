import { createSlice } from '@reduxjs/toolkit';
const markersSlice = createSlice({
  name: 'markers',
  initialState: { markersList: {}, loading: 'pending' },
  reducers: {
    markersUpdate(state, action) {
      state.markersList = action.payload;
    },
    markersLoaded(state) {
      state.loading = 'idle';
    },
  },
});
export default markersSlice.reducer