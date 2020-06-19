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

export const players = [
  { id: 'athos', name: 'Baurice Maltheiser-Targu' },
  { id: 'porthos', name: 'José Altuve' },
  { id: 'aramis', name: 'Francis Dubourg' },
]
export const gameMaster = { id: 'gameMaster', name: 'Maître du jeu' }

player = {
  athos:{name:'Baurice Maltheiser-Targu' }
}

const { actions, reducer } = playersSlice
export const { update } = actions

const configureStore = () => rtkConfigureStore({ reducer: reducer })
export default configureStore
