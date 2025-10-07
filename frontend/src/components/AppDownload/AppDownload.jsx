import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

function AppDownload() {
  return (
    <div className='app-download' id='app-download'>
        <p>For better experience download <br />Tomato App</p>
        <div className="app-download-platforms">
            <img src={assets.play_store} alt="Download from Play Store" />
            <img src={assets.app_store} alt="Download from App Store" />
        </div>
    </div>
  )
}

export default AppDownload
