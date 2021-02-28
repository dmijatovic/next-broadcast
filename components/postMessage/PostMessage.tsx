import {useState, useEffect} from 'react'

import {createWindow} from '../../utils/createWindow'

export default function PostMessage() {
  const [popup,setPopup] = useState<Window>()
  const [message,setMessage] = useState("Waiting for message from popup...")

  useEffect(()=>{
    window.addEventListener("message",handleMessage,false)
    return ()=>{
      // debugger
      console.log("PostMessage.useEffect.removeEventListener...executing")
      window.removeEventListener("message",handleMessage,false)
    }
  },[])

  function handleMessage(e){
    // listen to message from same origin
    if (e.origin===window.origin){
      const {data} = e
      //listen to only app specific message
      if (data && data.app && data.app==="dome2"){
        // console.log("PostMessage...received message...", e)
        setMessage(data)
      }
    }else{
      console.log("messages?!?...from other origin", e)
    }
  }

  function listenForClose(win:Window){
    if (win){
      win.addEventListener("beforeunload",function(e){
        // console.log("popup unloaded")
        setPopup(undefined)
        alert("Popup closed!!!")
      })
    }
  }

  function createPopup(){
    console.log("Create popup")
    const win = createWindow("/code/pm_article","code")
    if (win){
      listenForClose(win)
      setPopup(win)
    }
  }

  function sendMessage(){
    // debugger
    if (popup){
      popup.postMessage({
        app:"dome2",
        page:"PostMessage",
        payload:{
          date: new Date(),
          title:"Testing this messaging",
          items:[{
            id:1234345,
            name:"Name 1"
          },{
            id:1234346,
            name:"Name 2"
          }]
        }

      },window.origin)
      console.log("PostMessage...message send")
    }
  }

  function closePopup(){
    if (popup){
      popup.close()
    }
  }

  function popupFocus(){
    if (popup){
      // popup.moveBy(1000,0)
      popup.moveTo(1600,0)
      popup.focus()
    }
  }

  function popupResize(){
    if (popup){
      popup.resizeTo(600,600)
      popup.focus()
    }
  }

  return (
    <section>
      <h1>Post message</h1>
      <button onClick={createPopup}>Create window</button>
      <button onClick={sendMessage} disabled={popup ? false : true}>Send message to popup</button>
      <button onClick={popupFocus} disabled={popup ? false : true}>Focus popup</button>
      <button onClick={popupResize} disabled={popup ? false : true}>Resize popup</button>
      <button onClick={closePopup} disabled={popup ? false : true}>Close popup</button>
      <pre>{JSON.stringify(message,null,2)}</pre>
    </section>
  )
}