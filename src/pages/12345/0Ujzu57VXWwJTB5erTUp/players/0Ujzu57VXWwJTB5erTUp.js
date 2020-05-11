import React from "react"
import Paper from '@material-ui/core/Paper';
import Sheet from '../../../../components/sheet'

const PlayerSheet = ({ location }) => {
  const sheetId = location.pathname.split("/")[4]
  return (
    <Paper style={{ padding: '15px', marginBottom: '60px' }}>
      <Sheet sheetId={sheetId} />
    </Paper>
  )
}
export default PlayerSheet