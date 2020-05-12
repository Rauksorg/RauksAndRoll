import React from 'react'
import Paper from '@material-ui/core/Paper'
import Sheet from '../../../../components/sheet'

const PlayerSheet = ({ location }) => {
  const sheetId = location.pathname.split('/')[4]
  return (
    <Paper style={{ padding: '15px', margin: '0px 15px 60px 15px'  }}>
      <Sheet sheetId={sheetId} />
    </Paper>
  )
}
export default PlayerSheet
