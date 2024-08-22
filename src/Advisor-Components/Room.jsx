import React from 'react'
import {ZegoExpressEngine} from 'zego-express-engine-webrtc'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { getAuth } from 'firebase/auth'

function Room() {

    const { meetingid} = useParams()
    const auth= getAuth()

   const myMeeting = async (element) =>{
      const appID = 1852784495;
      const serverSecret = "fe48cf6388bbeca0b502f08c7a520156"
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, meetingid, Date.now().toString(), "Name");

      const zc = ZegoUIKitPrebuilt.create(kitToken)
      zc.joinRoom({
        container:element,
        sharedLinks:[
          {
            name:'Copy Link',
            url:`https://www.adviserxiis.com/room/${meetingid}`
          }
        ],
        scenario:{
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton:true
      })
   }
  

  return (
    <div className='h-screen'>
      <div ref={myMeeting}  className='h-screen'/>
    </div>
  )
}

export default Room