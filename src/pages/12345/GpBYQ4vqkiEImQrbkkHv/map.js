import React from "react";

const iframe = `<iframe width="100%" height="600px" frameborder="0" allowfullscreen src="//umap.openstreetmap.fr/fr/map/rauks-carte-du-monde_449372?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=false&allowEdit=false&moreControl=false&searchControl=false&tilelayersControl=false&embedControl=false&datalayersControl=false&onLoadPanel=undefined&captionBar=false&fullscreenControl=false&locateControl=false&measureControl=false&editinosmControl=false#15/53.09088/11.47436"></iframe>`

const Iframe = ({ iframe }) => (<div dangerouslySetInnerHTML={{ __html: iframe ? iframe : "" }} />);

export default () => <div> <Iframe iframe={iframe} /> </div>;