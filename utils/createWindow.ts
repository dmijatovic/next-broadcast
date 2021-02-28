
function calcOptions(type:string){
  let width=880, left=1, height=1020
  // height=screen.height
  if (type==="article"){
    width = 1024
    // width=screen.width - 880
    // if (width < 800) width = 800
    left = 885
  }
  return `menubar=no,location=no,resizable=no,scrollbars=yes,status=yes,top=0,left=${left},width=${width},height=${height}`
}

export function createWindow(url:string, type:("code"|"article")="code"):Window{
  const options=calcOptions(type)
  if (type==="article"){
    return window.open(url,"Article",options)
  }
  return window.open(url,"Code",options)
}
