import React from "react"
import Sheet from '../../../../components/sheet'

const PlayerSheet = ({ location }) => {
  const sheetId = location.pathname.split("/")[4]
  return <Sheet sheetId={sheetId} />
}
export default PlayerSheet
