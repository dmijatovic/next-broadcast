
import {useEffect, useState, useRef} from 'react'
import {createWindow} from '../../utils/createWindow'

export type msgType = "message"|"up"|"down"|"ping"


export default function BroadcastMessage(){
  const [channel,setChannel] = useState<BroadcastChannel>()
  const [messages,setMessages] = useState<string|string[]>("No message...")
  // it requires the refference to popup not to lose it with reloads
  const [popup,setPopup] = useState<Window>(undefined)
  const inputRef = useRef(undefined)

  useEffect(()=>{
    const c = new BroadcastChannel("dome2")
    if (c) setChannel(c)
  },[])

  useEffect(()=>{
    if (channel){
      channel.onmessage = (e)=>{
        const {app,page,type,payload}:{app:string,page:string,type:msgType,payload:string} = e.data
        // console.log("BroadcastMessage...onmessage...", e)
        // && page!="BroadcastMessage"
        if (app=="dome2" && page!="BroadcastMessage"){
          if (type==="down"){
            setPopup(undefined)
          }
          if (Array.isArray(messages)){
            // debugger
            setMessages([
              ...messages,
              payload
            ])
          }else{
            setMessages([payload])
          }
        }
      }
    }
  },[channel,messages])

  function sendPong(){
    // debugger
    if (channel){
      channel.postMessage({
        app: "dome2",
        page: "BroadcastMessage",
        type: "pong",
        payload: "pong!"
      })
    }
  }

  function sendPing(){
    // debugger
    if (channel){
      channel.postMessage({
        app: "dome2",
        page: "BroadcastMessage",
        type: "ping",
        payload: "ping!"
      })
    }
  }

  function sendMessage(){
    // debugger
    if (inputRef && inputRef.current){
      const text = inputRef.current.value
      channel.postMessage({
        app: "dome2",
        page: "BroadcastMessage",
        type: "message",
        payload: text
      })
    }
  }

  return(
    <section>
      <h1>Broadcast message</h1>
      <div>
        <button onClick={()=>{
          const popup = createWindow("/code/bm_article","code")
          setPopup(popup)
        }}>Open popup</button>

        <button
          disabled={popup ? false : true}
          onClick={()=>{
          popup.focus()
        }}>Focus popup</button>

        <button
          disabled={popup ? false : true}
          onClick={()=>{
          sendPing()
        }}>Ping!</button>

        <button
          disabled={popup ? false : true}
          onClick={()=>{
          popup.close()
        }}>Close popup</button>
      </div>
      <div>
        <input type="text" ref={inputRef}/>
        <button onClick={sendMessage}>Send message</button>
      </div>
      <div>
        <h3>Messages</h3>
        <pre>{JSON.stringify(messages,null,2)}</pre>
      </div>
    </section>
  )
}