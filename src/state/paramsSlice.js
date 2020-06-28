import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firebase from 'gatsby-plugin-firebase'

const firestoreUpdate = ({ gameId, param, data }) => {
  firebase.firestore().doc(`games/${gameId}/params/${param}`).update(data)
}

export const paramsUpdateField = createAsyncThunk('params/updateField', async ({ gameId, param, data }, { dispatch }) => {
  dispatch(paramsUpdateFieldStore({ data, param }))
  const response = await firestoreUpdate({ gameId, param, data })
  return response
})

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
    paramsUpdateFieldStore(state, action) {
      const data = action.payload.data
      const param = action.payload.param
      state.paramsList[param] = { ...state.paramsList[param], ...data }
    },
  },
})
export const { paramsUpdate, paramsLoaded, paramsUpdateFieldStore } = paramsSlice.actions

export default paramsSlice.reducer
