import { createSlice } from '@reduxjs/toolkit'
const layersSlice = createSlice({
  name: 'layers',
  initialState: { layersList: {}, loading: 'pending' },
  reducers: {
    layersUpdate(state, action) {
      state.layersList = action.payload
    },
    layersLoaded(state) {
      state.loading = 'idle'
    },
  },
})
export const { layersUpdate, layersLoaded } = layersSlice.actions

export default layersSlice.reducer
