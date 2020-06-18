import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import firebase from 'gatsby-plugin-firebase'
import {update} from '../../state/configureStore'

const convertArrayToObject = (array, key) => {
  const initialValue = {}
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    }
  }, initialValue)
}

const Fire = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`players`)
      .onSnapshot((querySnapshot) => {
        const playersArray = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        const playerObj = convertArrayToObject(playersArray, 'id')
        dispatch(update(playerObj))
      })
    return unsubscribe
  }, [dispatch])

  return <div></div>
}

const Rtkfirebase = () => {
  return (
      <Fire />
  )
}

export default Rtkfirebase
