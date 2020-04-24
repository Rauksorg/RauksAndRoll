import React from "react";

const iframe = `<iframe width="100%" height="600px" frameborder="0" allowfullscreen src="//umap.openstreetmap.fr/fr/map/lenzen-rauks_449329?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=null&allowEdit=false&moreControl=false&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=null&onLoadPanel=undefined&captionBar=false#15/53.0915/11.4755" />`

const Iframe = ({ iframe }) => {
  return (<div dangerouslySetInnerHTML={{ __html: iframe ? iframe : "" }} />);
}

export default () => {
  return (
    <div>
      <Iframe iframe={iframe}/>
      {/* <Img fixed={data.file.childImageSharp.fixed} /> */}
    </div>
  );
}

// import React from "react";
// import Img from "gatsby-image";
// import { graphql } from "gatsby";

// export default ({ data }) => {
//   return (
//     <div>
//       <Img fixed={data.file.childImageSharp.fixed} />
//     </div>
//   );
// }


// export const query = graphql`
//   query {
//     file(relativePath: { eq: "LenzenMap.jpg" }) {
//       childImageSharp  {
//         # Specify the image processing specifications right in the query.
//         # Makes it trivial to update as your page's design changes.
//         fixed(width: 1097, height: 591, quality: 90) {
//           ...GatsbyImageSharpFixed
//         }
//       }
//     }
//   }
// `