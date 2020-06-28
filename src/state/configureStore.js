import { configureStore as rtkConfigureStore } from '@reduxjs/toolkit'
import playersReducer from './playersSlice'
import markersReducer from './markersSlice'
import paramsReducer from './paramsSlice'
import layersReducer from './layersSlice'

const configureStore = () => rtkConfigureStore({ reducer: { players: playersReducer, markers: markersReducer, params: paramsReducer, layers: layersReducer } })
export default configureStore
