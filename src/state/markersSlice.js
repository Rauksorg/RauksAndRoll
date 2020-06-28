import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firebase from 'gatsby-plugin-firebase'

const firestoreUpdate = ({ gameId, markerId, data }) => {
  firebase.firestore().doc(`games/${gameId}/markers/${markerId}`).update(data)
}

const firestoreDelete = ({ gameId, markerId }) => {
  firebase.firestore().doc(`games/${gameId}/markers/${markerId}`).delete()
}

const firestoreCreate = ({ payload, ref }) => {
  ref.set(payload)
}

export const markersCreate = createAsyncThunk('markers/create', async ({ gameId, data }, { dispatch }) => {
  const { LngLat, name } = data
  const order = Date.now()
  const payload = { name, LngLat, order, color: '' }
  const ref = firebase.firestore().collection('games').doc(gameId).collection('markers').doc()
  const markerId = ref.id
  dispatch(markersCreateStore({ data: payload, markerId }))
  const response = await firestoreCreate({ payload, ref })
  return response
})

export const markersUpdateField = createAsyncThunk('markers/updateField', async ({ gameId, markerId, data }, { dispatch }) => {
  dispatch(markersUpdateFieldStore({ data, markerId }))
  const response = await firestoreUpdate({ gameId, markerId, data })
  return response
})

export const markersDelete = createAsyncThunk('markers/delete', async ({ gameId, markerId }, { dispatch }) => {
  dispatch(markersDeleteStore({ markerId }))
  const response = await firestoreDelete({ gameId, markerId })
  return response
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
    markersUpdateFieldStore(state, action) {
      const data = action.payload.data
      const markerId = action.payload.markerId
      state.markersList[markerId] = { ...state.markersList[markerId], ...data }
    },
    markersDeleteStore(state, action) {
      const markerId = action.payload.markerId
      delete state.markersList[markerId]
    },
    markersCreateStore(state, action) {
      const markerId = action.payload.markerId
      state.markersList[markerId] = action.payload.data
    },
  },
})

export const { markersUpdate, markersLoaded, markersUpdateFieldStore, markersDeleteStore, markersCreateStore } = markersSlice.actions

export default markersSlice.reducer
