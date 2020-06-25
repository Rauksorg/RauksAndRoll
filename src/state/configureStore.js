import { createSlice, configureStore as rtkConfigureStore } from '@reduxjs/toolkit'

const playersSlice = createSlice({
  name: 'players',
  initialState: { playersList: {}, loading: 'pending' },
  reducers: {
    playersUpdate(state, action) {
      state.playersList = action.payload
    },
    playersLoaded(state) {
      state.loading = 'idle'
    },
    modifyField(state, action) {
      const field = action.payload.field
      const value = action.payload.value
      const playerId = action.payload.playerId
      state.playersList[playerId][field] = value
    },
  },
})

const markersSlice = createSlice({
  name: 'markers',
  initialState: { markersList: {}, loading: 'pending' },
  reducers: {
    markersUpdate(state, action) {
      state.markersList = action.payload
    },
    markersLoaded(state) {
      state.loading = 'idle'
    },
  },
})

export const { playersUpdate, playersLoaded, modifyField } = playersSlice.actions
export const { markersUpdate, markersLoaded } = markersSlice.actions

const configureStore = () => rtkConfigureStore({ reducer: { players: playersSlice.reducer, markers: markersSlice.reducer } })
export default configureStore
