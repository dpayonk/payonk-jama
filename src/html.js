import React from "react"
import PropTypes from "prop-types"
import './styles/global.css'

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png"></link>
        {props.headComponents}
        <link href="https://fonts.cdnfonts.com/css/adlinnaka" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css" />
        <link async rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"/>
        <link async rel="stylesheet" href="//cdn.jsdelivr.net/npm/tui-image-editor@3.11.0/dist/tui-image-editor.min.css"/>

        
        <link href="/style-overrides.css" rel="stylesheet" />
        <script defer src="https://use.fontawesome.com/releases/v5.14.0/js/all.js" />
        <script defer src="https://go.metabet.io/js/global.js"></script>
        <script
        dangerouslySetInnerHTML= {{ __html: ` 
        window.$crisp=[];window.CRISP_WEBSITE_ID="051c9d05-11bd-4dae-a9f5-6ae3b1f716fe";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
         `}}
        />
          
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: props.body }}
          />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
