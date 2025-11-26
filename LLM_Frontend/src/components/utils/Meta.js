import React from 'react'
import {Helmet} from 'react-helmet'

const Meta = (props) => {
    const {title} = props;
  return (
    <Helmet>  
    <meta charSet="utf-8" />
    <link rel="icon" type="image/png" href="https://www.gartner.com/pi/vendorimages/glean_generative-ai-apps_1730225600358.png" style={{borderRadius:"50%"}} />
    {/* <link rel="icon" type="image/png" href="https://lucidworks.com/wp-content/uploads/2023/11/ai_can_do_icon.svg" style={{borderRadius:"50%"}} /> */}
    {/* <link rel="icon" type="image/png" href="https://backend.aionlinecourse.com/uploads/ai_software/image/2024/02/heygen.jpg" /> */}
    <title>{title}</title>
    </Helmet>
  )
}

export default Meta