import React from 'react'
// import IconButton from '@material-ui/core/IconButton'
// import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import Sheet from '../../../../components/sheet'

const PlayerSheet = ({ location }) => {
  const sheetId = location.pathname.split('/')[4]
  return (
    <div>
      {/* <IconButton>
        <ArrowBackIcon />
      </IconButton> */}
      <Paper style={{ padding: '15px', margin: '5px 15px 5px 15px' }}>
        <Sheet sheetId={sheetId} />
      </Paper>
    </div>
  )
}
export default PlayerSheet
