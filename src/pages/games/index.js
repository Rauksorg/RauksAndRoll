import React from 'react'
import { Link } from 'gatsby-theme-material-ui'
import { useSelector } from 'react-redux'

export default ({ location }) => {
  const search = location.search
  const playersList = useSelector((state) => state.players.playersList)
  const loading = useSelector((state) => state.players.loading)
  return loading === 'idle' ? (
    <div>
      <div>
        <Link to={`/games/gameMaster/players${search}`}>Play as {playersList.gameMaster.identification}</Link>
      </div>
      <div>
        <Link to={`/games/athos/players${search}`}>Play as {playersList.athos.identification}</Link>
      </div>
      <div>
        <Link to={`/games/porthos/players${search}`}>Play as {playersList.porthos.identification}</Link>
      </div>
      <div>
        <Link to={`/games/aramis/players${search}`}>Play as {playersList.aramis.identification}</Link>
      </div>
    </div>
  ) : (
    'Loading...'
  )
}
