const firebaseCreds = require('./firebaseCreds.js')
module.exports = {
  siteMetadata: {
    title: `Gatsby Theme Material-UI`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-theme-material-ui`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-layout`,
    {
      resolve: 'gatsby-plugin-firebase',
      options: {
        credentials: {
          apiKey: firebaseCreds.apiKey,
          authDomain: firebaseCreds.authDomain,
          databaseURL: firebaseCreds.databaseURL,
          projectId: firebaseCreds.projectId,
          storageBucket: firebaseCreds.storageBucket,
          messagingSenderId: firebaseCreds.messagingSenderId,
          appId: firebaseCreds.appId,
        },
      },
    },
  ],
}
