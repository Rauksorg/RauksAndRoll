import React from 'react'
import Paper from '@material-ui/core/Paper'
import Sheet from '../../../../components/sheet'
import Img from 'gatsby-image'
import { graphql } from 'gatsby'

const PlayerSheet = ({ location, data }) => {
  const sheetId = location.pathname.split('/')[4]
  return (
    <div>
      <Img style={{ margin: '7px 15px 10px 15px',maxHeight:'300px',borderRadius:'5px' }} fluid={data.file.childImageSharp.fluid} />
      <Paper style={{ padding: '15px', margin: '0px 15px 5px 15px' }}>
        <Sheet sheetId={sheetId} />
      </Paper>
    </div>
  )
}
export default PlayerSheet

export const query = graphql`
  query {
    file(relativePath: { eq: "HambourgLarge.jpg" }) {
      childImageSharp {
        fluid(maxHeight: 300, quality: 100) {
          ...GatsbyImageSharpFluid
          ...GatsbyImageSharpFluidLimitPresentationSize
        }
      }
    }
  }
`
