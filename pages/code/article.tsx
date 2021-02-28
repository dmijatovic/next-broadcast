import {useState, useEffect} from 'react'


export default function CodeArticle(){
  const [sender,setSender] = useState<Window>()
  const [message,setMessage] = useState("Waiting for message...")
  const [disabled,setDisabled] = useState(true)

  useEffect(()=>{
    window.addEventListener("message",handleMessage,false)
    if (window.opener){
      setDisabled(false)
      window.opener.postMessage({
        app:"dome2",
        page:"CodeArticle",
        payload:{
          state:"OPENED"
        }
      })
    }
    return ()=>{
      debugger
      //get reference to parent/opener
      window.opener.postMessage({
        app:"dome2",
        page:"CodeArticle",
        payload:{
          state:"CLOSING"
        }
      })
      console.log("CodeArticle.useEffect.removeEventListener...executing")
      window.removeEventListener("message",handleMessage,false)
    }
  },[])

  function handleMessage(e){
    // listen to message from same origin
    if (e.origin===window.origin){
      const {data} = e
      //listen to only app specific message
      if (data && data.app && data.app==="dome2"){
        console.log("CodeArticle...received message...", e)
        setMessage(data)
      }
    }else{
      console.log("messages?!?...from other origin", e)
    }
  }

  function sendMessage(){
    // debugger
    if (window.opener){
      window.opener.postMessage({
        app:"dome2",
        page:"CodeArticle",
        payload:{
          state:"LIVE",
          message:"Send you something interesting"
        }
      })
    }else{
      console.log("NO WINDOW OPENER?!?")
    }
  }

  return (
    <section>
      <h1>Code article</h1>
      <button onClick={sendMessage} disabled={disabled}>Send message to opener</button>
      <pre>{JSON.stringify(message,null,2)}</pre>
    </section>
  )
}