import React, { useEffect, useState } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import { ResponsivePie } from '@nivo/pie'
import groupBy from 'lodash/groupBy'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import { useSelector } from 'react-redux'

const Stats = () => {
  const [rawStats, setRawStats] = useState([])
  const [filteredStats, setFilteredStats] = useState([])
  const [rollPerplayerData, setRollPerplayerData] = useState([])
  const [filterCursorValue, setFilterCursorValue] = useState([])
  const [zoomCursorValue, setZoomCursorValue] = useState(1)
  const [timeOrigin, setTimeOrigin] = useState([])
  const playerById = useSelector((state) => state.playersList)

  const handleFilterChange = (event, newValue) => {
    const [oldStart, oldEnd] = filterCursorValue
    const [start, end] = newValue
    if (start === end) return
    if (oldStart === start && oldEnd === end) return
    setFilterCursorValue(newValue)
  }

  const handleZoomChange = (event, newValue) => {
    setZoomCursorValue(newValue)
  }

  const changeDataToRelativetime = (data) => {
    const origin = data[0].timeRolled
    setTimeOrigin(origin)
    return data.map(({ timeRolled, ...others }) => ({ timeRolled: timeRolled, relativeTime: origin - timeRolled, ...others }))
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('dicesLogs')
      .orderBy('timeRolled', 'desc')
      .onSnapshot((querySnapshot) => {
        const dataFromServer = []
        let key = 0
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.playerId !== 'NvysJ1bND6X1RONVG3Yu') {
            dataFromServer.push({ ...data, id: key, name: playerById[data.playerId].name })
            key++
          }
        })
        setRawStats(dataFromServer)
      })
    return unsubscribe
  }, [playerById])

  useEffect(() => {
    if (!rawStats[0]) return
    setFilterCursorValue(([start = 0, end = rawStats.length]) => {
      return end === rawStats.length - 1 ? [start, rawStats.length] : [start, end] //Should use a boolean set from handleFilterChange() ?
    })
  }, [rawStats])

  useEffect(() => {
    if (!rawStats.length) return
    if (!filterCursorValue.length) return
    const [start, end] = filterCursorValue
    const statLength = rawStats.length
    const newStatsData = rawStats.slice(statLength - end, statLength - start)
    setFilteredStats(changeDataToRelativetime(newStatsData))
  }, [rawStats, filterCursorValue])

  useEffect(() => {
    if (!filteredStats.length) return
    const groupedData = groupBy(filteredStats, 'name')
    const rollsPerplayer = Object.keys(groupedData).map((item) => {
      return { id: item, label: item, value: groupedData[item].length }
    })
    setRollPerplayerData(rollsPerplayer)
  }, [filteredStats])

  return (
    <div>
      {filteredStats.length ? (
        <div>
          <div style={{ overflowX: zoomCursorValue === 1 ? 'visible' : 'auto', height: '500px' }}>
            <div style={{ width: zoomCursorValue * 100 + '%', height: '98%' }}>
              <ResponsiveSwarmPlot
                data={filteredStats}
                groupBy='name'
                groups={Object.keys(playerById).map((value) => playerById[value].name)}
                value={(e) => e.relativeTime / 1000}
                valueFormat={(e) => {
                  const date = new Date(-e * 1000 + timeOrigin)
                  const day = date.getDate()
                  const month = date.getMonth()
                  const year = date.getFullYear()
                  const hours = date.getHours()
                  const minutes = '0' + date.getMinutes()
                  const seconds = '0' + date.getSeconds()
                  const formattedTime = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)} ${day}/${month + 1}/${year}`
                  return formattedTime
                }}
                animate={false}
                label={(e) => (`${e.data.diceResult}${e.data.rerolled ? 'R' : ''}`)}
                colors={(e) => e.data.dice}
                valueScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: true }}
                size={30}
                layout='horizontal'
                simulationIterations={90}
                margin={{ top: 80, right: 100, bottom: 80, left: 100 }}
                axisTop={{
                  orient: 'top',
                  tickSize: 10,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisRight={{
                  orient: 'right',
                  tickSize: 10,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisBottom={{
                  orient: 'bottom',
                  tickSize: 10,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisLeft={{
                  orient: 'left',
                  tickSize: 10,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
              />
            </div>
          </div>
          <div>
            <Typography gutterBottom>Filter</Typography>
            <Slider value={filterCursorValue} onChange={handleFilterChange} valueLabelDisplay='auto' min={0} max={rawStats.length} />
            <Typography gutterBottom>Zoom</Typography>
            <Slider value={zoomCursorValue} onChange={handleZoomChange} valueLabelDisplay='auto' step={1} marks min={1} max={10} />
          </div>
        </div>
      ) : (
        'Loading...'
      )}

      <div style={{ width: '100%', height: '500px' }}>
        {rollPerplayerData.length ? (
          <ResponsivePie
            data={rollPerplayerData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor='#333333'
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: 'color' }}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor='#333333'
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
          />
        ) : (
          'Loading...'
        )}
      </div>
    </div>
  )
}

export default Stats
