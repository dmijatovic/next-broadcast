import {useEffect, useState, useRef} from 'react'

export default function BmArticle(){
  const [channel,setChannel] = useState<BroadcastChannel>()
  const [messages,setMessages] = useState<string|string[]>("No message...")
  const inputRef = useRef(undefined)
  /**
   * Listen to closing event need to be attached and removed
   * on each loading of the component. High likely the componenent
   * is reloaded lot with useState and other hooks.
   * To send message when window is closed we listen to unload event
   * NOT beforeunload. Somehow beforeunload will not send message?!?
   * Probably because it has its own question popup and return values
   */
  useEffect(() => {
    // window.addEventListener('beforeunload', alertUser)
    window.addEventListener('unload', handleClosing)
    return () => {
        // window.removeEventListener('beforeunload', alertUser)
        window.removeEventListener('unload', handleClosing)
    }
  })

  useEffect(()=>{
    const c = new BroadcastChannel("dome2")
    if (c) {
      c.postMessage({
        app: "dome2",
        page: "BmArticle",
        type: "up",
        payload: "I am up :-)"
      })
      setChannel(c)
    }
  },[])

  useEffect(()=>{
    if (channel){
      channel.onmessage = (e)=>{
        // console.log("BmArticle...onmessage...", e)
        const {app,page,type,payload} = e.data
        // && page!="BroadcastMessage"
        if (app=="dome2" && page!="BmArticle"){
          if (type==="ping"){
            sendPong()
          }
          if (Array.isArray(messages)){
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


  function handleClosing(){
    channel.postMessage({
      app: "dome2",
      page: "BmArticle",
      type: "down",
      payload: "I am down :-("
    })
  }

  const alertUser = (event:any) => {
    event.preventDefault()
    event.returnValue = ''
  }

  function sendPong(){
    // debugger
    if (channel){
      channel.postMessage({
        app: "dome2",
        page: "BmArticle",
        type: "pong",
        payload: "pong!"
      })
    }
  }


  function sendMessage(){
    // debugger
    if (inputRef && inputRef.current){
      const text = inputRef.current.value
      channel.postMessage({
        app: "dome2",
        page: "BmArticle",
        type: "message",
        payload: text
      })
    }
  }

  return (
    <section>
      <h1>BM article</h1>
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