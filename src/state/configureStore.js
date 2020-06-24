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
  },
})

const { actions, reducer } = playersSlice
export const { update, loaded } = actions

const configureStore = () => rtkConfigureStore({ reducer: reducer })
export default configureStore
