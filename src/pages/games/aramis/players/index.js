import React, { useState, useEffect } from 'react'
import firebase from 'gatsby-plugin-firebase'
import Paper from '@material-ui/core/Paper'
import { Button } from 'gatsby-theme-material-ui'

import PlayersList from '../../../../components/playersList'
import Sheet from '../../../../components/sheet'

import { players, gameMaster } from '../../index'

const nullResults = {
  gameMaster: { diceResult: null, dice: null },
  athos: { diceResult: null, dice: null },
  porthos: { diceResult: null, dice: null },
  aramis: { diceResult: null, dice: null },
}

const PlayersListPage = ({ location }) => {
  const sheetId = location.pathname.split('/')[2]
  console.log(sheetId)
  const search = location.search
  const urlParams = new URLSearchParams(search)
  const gameId = urlParams.get('g')
  console.log(gameId)

  const [results, setResults] = useState(nullResults)
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`games`)
      .doc(gameId)
      .collection('players')
      .onSnapshot((querySnapshot) => {
        const playersList = {}
        querySnapshot.forEach((doc) => {
          playersList[doc.id] = doc.data()
        })
        setResults(playersList)
        console.log(playersList)
      })
    return unsubscribe
  }, [gameId])

  return (
    <div style={{ margin: '5px 15px 5px 15px' }}>
      <Paper style={{ marginBottom: '10px' }}>
        <PlayersList location={location} players={players} gameMaster={gameMaster} results={results} />
      </Paper>
      <Paper style={{ padding: '15px' }}>
        <Sheet sheetId={`${gameId}/players/${sheetId}`} />
      </Paper>
      <Button variant='outlined' to={`/12345/${sheetId}/players/logbook`} style={{ marginTop: '5px' }}>
        Logbook
      </Button>
    </div>
  )
}

export default PlayersListPage
