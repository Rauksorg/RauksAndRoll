import React from 'react'
import Paper from '@material-ui/core/Paper'
import { Button } from 'gatsby-theme-material-ui'
import { useSelector } from 'react-redux'

import PlayersList from '../../../../components/playersList'
import Sheet from '../../../../components/sheet'

const PlayersListPage = ({ location }) => {
  const sheetId = location.pathname.split('/')[2]
  const search = location.search
  const urlParams = new URLSearchParams(search)
  const gameId = urlParams.get('g')

  const playersList = useSelector((state) => state.players.playersList)
  const loading = useSelector((state) => state.players.loading)

  return loading === 'idle' ? (
    <div style={{ margin: '5px 15px 5px 15px' }}>
      <Paper style={{ marginBottom: '10px' }}>
        <PlayersList location={location} results={playersList} />
      </Paper>
      <Paper style={{ padding: '15px' }}>
        <Sheet sheetId={sheetId} sheetId2={sheetId}/>
      </Paper>
      <Button variant='outlined' to={`${gameId}/${sheetId}/players/logbook`} style={{ marginTop: '5px' }}>
        Logbook
      </Button>
    </div>
  ) : (
    'Loading...'
  )
}

export default PlayersListPage
