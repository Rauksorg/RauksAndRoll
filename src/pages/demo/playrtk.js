import React from 'react'
import { combineReducers } from 'redux'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
})

const { actions, reducer } = counterSlice
const { increment, decrement } = actions

const store = configureStore({
  reducer: combineReducers({
    counterSlice: reducer,
  }),
})

const Butt = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.counterSlice)
  const dec = () => {
    dispatch(decrement())
  }
  const inc = () => {
    dispatch(increment())
  }
  return (
    <div>
      <button onClick={inc}>+</button>
      <button onClick={dec}>-</button>
      <div>{state}</div>
    </div>
  )
}

const Playrtk = () => {
  return (
      <Butt />
  )
}

export default Playrtk
