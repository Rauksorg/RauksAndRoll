import React, { useEffect, useState } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import groupBy from 'lodash/groupBy'

const Stats = () => {
  const [statsData, setStatsData] = useState(null)
  const [groupedByPlayer, setGroupedByPlayer] = useState([])

  useEffect(() => {
    firebase
      .firestore()
      .collection('dicesLogs')
      .orderBy('timeRolled', 'desc')
      .get()
      .then((querySnapshot) => {
        const dataFromServer = []
        querySnapshot.forEach((doc) => {
          dataFromServer.push(doc.data())
        })
        setStatsData(dataFromServer)
      })
  }, [])

  useEffect(() => {
    console.log('statdata', statsData)
    if (!statsData) return
    const groupedData = groupBy(statsData, 'playerId')
    const filteredGroupedData = Object.keys(groupedData).map((item, key) => {
      return { id: item, data: groupedData[item].map((value) => ({ x: value.timeRolled, y: key,color:value.dice })) }
    })
   
    console.log(groupedData)
    console.log(filteredGroupedData)
     setGroupedByPlayer(filteredGroupedData)
  }, [statsData])

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ResponsiveScatterPlot
        data={groupedByPlayer}
        colors={(e) => {
          return e.color
        }}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        xFormat={function (e) {
          return e + ' kg'
        }}
        yScale={{ type: 'linear', min: 0, max: 'auto' }}
        yFormat={function (e) {
          return e + ' cm'
        }}
        blendMode='multiply'
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'weight',
          legendPosition: 'middle',
          legendOffset: 46,
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'size',
          legendPosition: 'middle',
          legendOffset: -60,
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 5,
            itemDirection: 'left-to-right',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  )
}

export default Stats
