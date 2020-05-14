import React, { useEffect, useRef } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from 'gatsby-theme-material-ui'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

const useStyles = makeStyles({
  height100: {
    width: '100%',
    // height: '100vh', /* Fallback for browsers that do not support Custom Properties */
    height: 'calc(var(--vh, 1vh) * 100 - 56px)',
  },
})

const Geojson = () => {
  const classes = useStyles()
  const editorRef = useRef(null)

  const resize = () => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const container = document.getElementById('jsoneditor')
    const options = { mode: 'code' }
    const editor = new JSONEditor(container, options)
    editor.setText('{"data":"loading"}')
    editorRef.current = editor
    return () => {
      editor.destroy()
    }
  }, [])

  useEffect(() => {
    firebase
      .firestore()
      .collection(`layers`)
      .doc('xNMZJLF9yLNEZGGUPLQc')
      .get()
      .then((doc) => {
        editorRef.current.updateText(doc.data().geojson)
      })
  }, [])
  const saveLayer = () => {
    const json = editorRef.current.getText()
    firebase.firestore().collection('layers').doc('xNMZJLF9yLNEZGGUPLQc').update({ geojson: json })
  }

  return (
    <div>
      <div id='jsoneditor' className={classes.height100}></div>
      <Button onClick={saveLayer} variant='contained'>
        Save
      </Button>
    </div>
  )
}

export default Geojson
