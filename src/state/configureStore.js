import { createSlice, configureStore as rtkConfigureStore } from '@reduxjs/toolkit'

const playersSlice = createSlice({
  name: 'players',
  initialState: {},
  reducers: {
    update(_, action) {
      return action.payload
    },
  },
})

const { actions, reducer } = playersSlice
export const { update } = actions

const configureStore = () => rtkConfigureStore({ reducer: reducer })
export default configureStore
