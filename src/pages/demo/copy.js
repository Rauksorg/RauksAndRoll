import React, { useEffect } from 'react'
import firebase from 'gatsby-plugin-firebase'



const Copy = () => {
  useEffect(() => {
    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        console.log(error.code, error.message)
      })
  }, [])

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.isAnonymous, user.uid)
      } else {
        console.log('out')
      }
    })
  }, [])

//   const gameName = 'NUDpmg1FZRp7fkha2Yvr'

//   useEffect(() => {
//     const collection = 'players'
//     // GM
//     firebase
//       .firestore()
//       .collection(collection)
//       .doc('NvysJ1bND6X1RONVG3Yu')
//       .get()
//       .then((doc) => {
//         console.log(doc.data())
//         firebase.firestore().collection('games').doc(gameName).collection(collection).doc('gameMaster').set(doc.data())
//       })
//     // athos
//     firebase
//       .firestore()
//       .collection(collection)
//       .doc('0Ujzu57VXWwJTB5erTUp')
//       .get()
//       .then((doc) => {
//         console.log(doc.data())
//         firebase.firestore().collection('games').doc(gameName).collection(collection).doc('athos').set(doc.data())
//       })
//     // porthos
//     firebase
//       .firestore()
//       .collection(collection)
//       .doc('GpBYQ4vqkiEImQrbkkHv')
//       .get()
//       .then((doc) => {
//         console.log(doc.data())
//         firebase.firestore().collection('games').doc(gameName).collection(collection).doc('porthos').set(doc.data())
//       })
//     // aramis
//     firebase
//       .firestore()
//       .collection(collection)
//       .doc('yhSG30Rf9lB0Me9sLoRS')
//       .get()
//       .then((doc) => {
//         console.log(doc.data())
//         firebase.firestore().collection('games').doc(gameName).collection(collection).doc('aramis').set(doc.data())
//       })
//   }, [])

//   useEffect(() => {
//     const collection = 'layers'
//     firebase
//       .firestore()
//       .collection(collection)
//       .doc('xNMZJLF9yLNEZGGUPLQc')
//       .get()
//       .then((doc) => {
//         console.log(doc.data())
//         firebase.firestore().collection('games').doc(gameName).collection(collection).doc('general').set(doc.data())
//       })
//   }, [])

//   useEffect(() => {
//     const collection = 'markersv2'
//     firebase
//       .firestore()
//       .collection(collection)
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           console.log(doc.data())
//           firebase.firestore().collection('games').doc(gameName).collection('markers').doc(doc.id).set(doc.data())
//         })
//       })
//   }, [])

//   useEffect(() => {
//     const collection = 'logbook'
//     firebase
//       .firestore()
//       .collection(collection)
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           console.log(doc.data())
//           firebase.firestore().collection('games').doc(gameName).collection(collection).doc(doc.id).set(doc.data())
//         })
//       })
//   }, [])
//   useEffect(() => {
//     const collection = 'params'
//     firebase
//       .firestore()
//       .collection(collection)
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           console.log(doc.data())
//           firebase.firestore().collection('games').doc(gameName).collection(collection).doc(doc.id).set(doc.data())
//           if(doc.data().id='mapCenter') firebase.firestore().collection('games').doc(gameName).collection(collection).doc('map').set(doc.data())
//         })
//       })
//   }, [])
//   useEffect(() => {
//     const collection = 'dicesLogs'
//     firebase
//       .firestore()
//       .collection(collection)
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           console.log(doc.data())
//           firebase.firestore().collection('games').doc(gameName).collection(collection).doc(doc.id).set(doc.data())
//         })
//       })
//   }, [])

  return <div>Copied</div>
}

export default Copy
