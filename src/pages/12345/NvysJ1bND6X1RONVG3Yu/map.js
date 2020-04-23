import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";

export default ({ data }) => {
  return (
    <div>
      <Img fixed={data.file.childImageSharp.fixed} />
    </div>
  );
}

export const query = graphql`
  query {
    file(relativePath: { eq: "LenzenMap.jpg" }) {
      childImageSharp  {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fixed(width: 1097, height: 591, quality: 90) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`