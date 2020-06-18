import React from 'react'
import { Link } from 'gatsby-theme-material-ui'

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {})

export const players = [
  { id: 'athos', name: 'Baurice Maltheiser-Targu' },
  { id: 'porthos', name: 'José Altuve' },
  { id: 'aramis', name: 'Francis Dubourg' },
]
export const gameMaster = { id: 'gameMaster', name: 'Maître du jeu' }

export const playerById = arrayToObject(players, 'id')

export default ({location}) => {
  const search = location.search
  // const urlParams = new URLSearchParams(location.search)
  // const gameId = urlParams.get('g')
  return (
    <div>
      <div>
        <Link to={`/games/gamemaster/players${search}`}>Play as {gameMaster.name}</Link>
      </div>
      <div>
        <Link to={`/games/athos/players${search}`}>Play as {players[0].name}</Link>
      </div>
      <div>
        <Link to={`/games/porthos/players${search}`}>Play as {players[1].name}</Link>
      </div>
      <div>
        <Link to={`/games/aramis/players${search}`}>Play as {players[2].name}</Link>
      </div>
    </div>
  )
}
