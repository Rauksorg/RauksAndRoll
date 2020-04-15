const firebaseCreds = require("./firebaseCreds.js")
module.exports = {
  siteMetadata: {
    title: `Gatsby Theme Material-UI`,
  },
  plugins: [`gatsby-theme-material-ui`,
  `gatsby-plugin-layout`,
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: firebaseCreds.apiKey,
          authDomain: firebaseCreds.authDomain,
          databaseURL: firebaseCreds.databaseURL,
          projectId: firebaseCreds.projectId,
          storageBucket: firebaseCreds.storageBucket,
          messagingSenderId: firebaseCreds.messagingSenderId,
          appId: firebaseCreds.appId
        }
      }
    }
  ]
};
