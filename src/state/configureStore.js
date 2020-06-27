import { configureStore as rtkConfigureStore } from '@reduxjs/toolkit'
import playersReducer from './playersSlice'
import  markersReducer  from './markersSlice'

const configureStore = () => rtkConfigureStore({ reducer: { players: playersReducer, markers: markersReducer } })
export default configureStore
