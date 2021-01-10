
const bannerStyle = {
    top: "0px",
    left: "0px",
    width: "100%",
    textAlign: "center", 
    color: "white",
    minHeight: "40px",
    background: "red",
    padding: "10px 5px",
    marginBottom: "10px"
}

const squareImageStyle = {
  maxWidth: "50vw"
}


function getBannerStyle(environment){
  let customStyle = {
    background: 'green'
  }
  if(environment !== 'production'){
    customStyle.background = 'red';
  }

  return { ...bannerStyle, ...customStyle};
}
 
export {bannerStyle, getBannerStyle, squareImageStyle};