import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props)

    this.localVideoref = React.createRef()
    this.remoteVideoref = React.createRef()
  }

  componentDidMount() {
    //Example of configuration object
    const pc_config = null
    // const pc_config = {
    //   "iceServers": [
    //     {
    //       urls: 'stun:[STUN-IP]:[PORT]',
    //       'credential': '[YOUR CREDENTIAL]',
    //       'username': '[USERNAME]'
    //     }
    //   ]
    // }

    this.pc = new RTCPeerConnection(pc_config)

    this.pc.onicecandidate = (e) => {
      if (e.candidate) console.log(JSON.stringify(e.candidate))
    }

    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e)
    }

    // this.pc.onaddstream = (e) => {
    //   this.remoteVideoref.current.srcObject = e.stream
    // }
    this.pc.ontrack = (e) => {
      this.remoteVideoref.current.srcObject = e.streams[0]
    }

     //To access our camera method
     const constraints = { video: true }

     const success = (stream) => {
       window.localStream = stream
       this.localVideoref.current.srcObject = stream
       this.pc.addStream(stream)
     }
 
     const failure = (e) => {
       console.log('getUserMedia Error: ', e)
     }
 
     navigator.mediaDevices.getUserMedia( constraints )
     .then( success )
     .catch( failure )
  }
 
     //Another way of writing this code
     // (async () => {
     //   const stream = await navigator.mediaDevices.getUserMedia( constraints )
     //   success(stream)
     // })().catch( failure )

     createOffer = () => {
       console.log('Offer')
       this.pc.createOffer({offerToReceiveVideo: 1})
          .then(sdp => {
            console.log(JSON.stringify(sdp))
            this.pc.setLocalDescription(sdp)
          }, e => {})
     }

     setRemoteDescription = () => {
      // retrieve and parse the SDP copied from the remote peer
      const desc = JSON.parse(this.textref.value)
  
      // set sdp as remote description
      this.pc.setRemoteDescription(new RTCSessionDescription(desc))
    }

     createAnswer = () => {
      console.log('Answer')
      this.pc.createAnswer({ offerToReceiveVideo: 1 })
        .then(sdp => {
          // console.log(JSON.stringify(sdp))
  
          // set answer sdp as local description
          this.pc.setLocalDescription(sdp)
  
          this.sendToPeer('offerOrAnswer', sdp)
      })
    }

     addCandidate = () => {
       const candidate = JSON.parse(this.textref.value)
       console.log('Adding candidate:', candidate)

       this.pc.addIceCandidate(new RTCIceCandidate(candidate))
     }

 

  render() {

    return (
      <div className="App">
        <video 
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: 'black'
          }}
          ref={this.localVideoref} 
          autoPlay>

        </video>

        <video 
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: 'black'
          }}
          ref={this.remoteVideoref} 
          autoPlay>
        </video>

        <button onClick={this.createOffer}>Offer</button>
        <button onClick={this.createAnwer}>Answer</button>
        <br />
        <textarea ref={ref => { this.textref = ref }} />
        <br />
        <button onClick={this.setRemoteDescription}>Set Remote Description</button>
        <button onClick={this.addCandidate}>Add Candidate</button>
      </div>
    );
  }
}

export default App;
