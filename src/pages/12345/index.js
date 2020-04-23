import React from "react";
import { Link } from "gatsby-theme-material-ui";

export const players = [{ id: 'NvysJ1bND6X1RONVG3Yu', name: 'MJ' }, { id: '0Ujzu57VXWwJTB5erTUp', name: 'Günther Olsen' }, { id: 'GpBYQ4vqkiEImQrbkkHv', name: 'Arakel Sarif' }, { id: 'yhSG30Rf9lB0Me9sLoRS', name: 'Jean Test' }]

export default () => {
  return (
    <div>
      <div>
        <Link to={`/12345/${players[0].id}/players`}>
          Play as {players[0].name}
        </Link>
      </div>

      <div>
        <Link to={`/12345/${players[1].id}/players`}>
          Play as {players[1].name}
        </Link>
      </div>

      <div>
        <Link to={`/12345/${players[2].id}/players`}>
          Play as {players[2].name}
        </Link>
      </div>

      <div>
        <Link to={`/12345/${players[3].id}/players`}>
          Play as {players[3].name}
        </Link>
      </div>

    </div>
  );
}
