import React from 'react'
import { Link } from 'gatsby-theme-material-ui'

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {})

export const players = [
  { id: 'NvysJ1bND6X1RONVG3Yu', name: 'MJ' },
  { id: '0Ujzu57VXWwJTB5erTUp', name: 'Baurice Maltheiser-Targu' },
  { id: 'GpBYQ4vqkiEImQrbkkHv', name: 'José Altuve' },
  { id: 'yhSG30Rf9lB0Me9sLoRS', name: 'Francis Dubourg' },
]
export const playerById = arrayToObject(players, 'id')

export default () => (
  <div>
    <div>
      <Link to={`/12345/${players[0].id}/players`}>Play as {players[0].name}</Link>
    </div>
    <div>
      <Link to={`/12345/${players[1].id}/players`}>Play as {players[1].name}</Link>
    </div>
    <div>
      <Link to={`/12345/${players[2].id}/players`}>Play as {players[2].name}</Link>
    </div>
    <div>
      <Link to={`/12345/${players[3].id}/players`}>Play as {players[3].name}</Link>
    </div>
  </div>
)
