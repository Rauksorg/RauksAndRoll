import { createSlice, configureStore as rtkConfigureStore } from '@reduxjs/toolkit'

const playersSlice = createSlice({
  name: 'players',
  initialState: { playersList: {}, loading: 'pending' },
  reducers: {
    update(state, action) {
      state.playersList = action.payload
    },
    loaded(state) {
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

const { actions, reducer } = playersSlice
export const { update, loaded, modifyField } = actions

const configureStore = () => rtkConfigureStore({ reducer: reducer })
export default configureStore
