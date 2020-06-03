import React, { useState, useEffect } from 'react'
import firebase from 'gatsby-plugin-firebase'
import Paper from '@material-ui/core/Paper'
import { Button } from 'gatsby-theme-material-ui'

import PlayersList from '../../../../components/playersList'
import Sheet from '../../../../components/sheet'

import { players, gameMaster } from '../../index'

const nullResults = {
  NvysJ1bND6X1RONVG3Yu: { diceResult: null, dice: null },
  '0Ujzu57VXWwJTB5erTUp': { diceResult: null, dice: null },
  GpBYQ4vqkiEImQrbkkHv: { diceResult: null, dice: null },
  yhSG30Rf9lB0Me9sLoRS: { diceResult: null, dice: null },
}

const PlayersListPage = ({ location }) => {
  const sheetId = location.pathname.split('/')[2]

  const [results, setResults] = useState(nullResults)
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`players`)
      .onSnapshot((querySnapshot) => {
        const playersList = {}
        querySnapshot.forEach((doc) => {
          playersList[doc.id] = doc.data()
        })
        setResults(playersList)
      })
    return unsubscribe
  }, [])

  return (
    <div style={{ margin: '5px 15px 5px 15px' }}>
      <Paper style={{ marginBottom: '10px' }}>
        <PlayersList location={location} players={players} gameMaster={gameMaster} results={results} />
      </Paper>
      <Paper style={{ padding: '15px' }}>
        <Sheet sheetId={sheetId} />
      </Paper>
      <Button variant='outlined' to={`/12345/${sheetId}/players/logbook`} style={{marginTop:'5px'}}>Logbook</Button>
    </div>
  )
}

export default PlayersListPage
