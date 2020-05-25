import React, { useEffect, useState } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import { ResponsivePie } from '@nivo/pie'
import groupBy from 'lodash/groupBy'
import { playerById } from '../index'
import Slider from '@material-ui/core/Slider'
const Stats = () => {
  const [statsData, setStatsData] = useState([])
  const [rollPerplayerData, setRollPerplayerData] = useState([])
  const [filteredStatsData, setFilteredStatsData] = useState([])

  const [value, setValue] = useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    const [oldStart, oldEnd] = value
    const [start, end] = newValue
    if (oldStart === start && oldEnd === end) return
    const statLength = statsData.length
    const newStatsData = statsData.slice(statLength - end, statLength - start)
    setFilteredStatsData(newStatsData)
  }

  useEffect(() => {
    firebase
      .firestore()
      .collection('dicesLogs')
      .orderBy('timeRolled', 'desc')
      .get()
      .then((querySnapshot) => {
        const dataFromServer = []
        let key = 0
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.playerId !== 'NvysJ1bND6X1RONVG3Yu') {
            dataFromServer.push({ ...data, id: key, name: playerById[data.playerId].name })
            key++
          }
        })
        setValue([0, dataFromServer.length])
        setFilteredStatsData(dataFromServer)
        setStatsData(dataFromServer)
      })
  }, [])

  useEffect(() => {
    if (!filteredStatsData) return
    const groupedData = groupBy(filteredStatsData, 'name')

    const rollsPerplayer = Object.keys(groupedData).map((item) => {
      return { id: item, label: item, value: groupedData[item].length }
    })
    setRollPerplayerData(rollsPerplayer)
  }, [filteredStatsData])

  return (
    <div>
      {filteredStatsData ? (
        <div>
          <div style={{ width: '100%', height: '500px' }}>
            <ResponsiveSwarmPlot
              data={filteredStatsData}
              groupBy='name'
              groups={Object.keys(playerById).map((value) => playerById[value].name)}
              value={(e) => e.timeRolled}
              valueFormat={(e) => {
                const date = new Date(e)
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
              label={(e) => e.data.diceResult}
              colors={(e) => e.data.dice}
              valueScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: false }}
              size={30}
              layout='horizontal'
              simulationIterations={100}
              margin={{ top: 80, right: 100, bottom: 80, left: 100 }}
              axisTop={null}
              axisRight={{
                orient: 'right',
                tickSize: 10,
                tickPadding: 5,
                tickRotation: 0,
              }}
              enableGridX={false}
              axisBottom={null}
              axisLeft={{
                orient: 'left',
                tickSize: 10,
                tickPadding: 5,
                tickRotation: 0,
              }}
            />
          </div>
          <div>
            <Slider value={value} onChange={handleChange} valueLabelDisplay='auto' min={0} max={statsData.length} />
          </div>
        </div>
      ) : (
        'Loading...'
      )}

      <div style={{ width: '100%', height: '500px' }}>
        {rollPerplayerData ? (
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
