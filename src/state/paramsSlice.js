import { createSlice } from '@reduxjs/toolkit'
const paramsSlice = createSlice({
  name: 'params',
  initialState: { paramsList: {}, loading: 'pending' },
  reducers: {
    paramsUpdate(state, action) {
      state.paramsList = action.payload
    },
    paramsLoaded(state) {
      state.loading = 'idle'
    },
  },
})
export const { paramsUpdate, paramsLoaded } = paramsSlice.actions

export default paramsSlice.reducer
