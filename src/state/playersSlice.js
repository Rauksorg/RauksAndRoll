import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firebase from 'gatsby-plugin-firebase'
import debounce from 'lodash/debounce'

// try to find better names fo those thunk
const updateFieldDb = ({ gameId, playerId, field, value }) => {
  firebase
    .firestore()
    .doc(`games/${gameId}/players/${playerId}`)
    .update({
      [field]: value,
    })
}

const updateFieldDbV2 = ({ gameId, playerId, data }) => {
  firebase.firestore().doc(`games/${gameId}/players/${playerId}`).update(data)
}

const debouncedUpdate = debounce(updateFieldDb, 500, { leading: false })
export const modifyFieldDb = createAsyncThunk('players/modifyFieldDb', async ({ gameId, playerId, field, value }, { dispatch }) => {
  dispatch(modifyField({ value: value, field: field, playerId: playerId }))
  const response = await updateFieldDb({ value: value, field: field, playerId: playerId, gameId: gameId })
  return response
})
export const modifyFieldDbV2 = createAsyncThunk('players/modifyFieldDb', async ({ gameId, playerId, data }, { dispatch }) => {
  dispatch(modifyFieldV2({ data: data, playerId: playerId }))
  const response = await updateFieldDbV2({ data: data, playerId: playerId, gameId: gameId })
  return response
})
export const modifyFieldDbDebounced = createAsyncThunk('players/modifyFieldDb', async ({ gameId, playerId, field, value }, { dispatch }) => {
  dispatch(modifyField({ value: value, field: field, playerId: playerId }))
  const response = await debouncedUpdate({ value: value, field: field, playerId: playerId, gameId: gameId })
  return response
})

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
    modifyFieldV2(state, action) {
      const data = action.payload.data
      const playerId = action.payload.playerId
      state.playersList[playerId] = { ...state.playersList[playerId], ...data }
    },
  },
})

export const { playersUpdate, playersLoaded, modifyField, modifyFieldV2 } = playersSlice.actions

export default playersSlice.reducer
