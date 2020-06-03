import React from 'react'
import text from '../../components/transcript/gameTranscript'

const Transcript = () => {
  const carac = ['Francis', 'José', 'Beaurice', 'MJ']
  return (
    <div>
      {text.map((element, key) => (
        <div style={{ marginBottom: '10px' }} key={key}>
          {carac[element.channelTag-1] + ' : ' + element.alternatives[0].transcript}
        </div>
      ))}
    </div>
  )
}

export default Transcript
