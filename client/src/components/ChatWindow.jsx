import Sockette from 'sockette';
import React, {useState} from 'react'
import {Launcher} from 'react-chat-window'
const ChatWindow = () => {
const [messageList, setMessageList] = useState([]);

const onMessageWasSent = (message) => {
  setMessageList([...messageList, message]);
  console.log(message.data.text)
  ws.send(JSON.stringify({"action" : "onMessage" , "message" : message.data.text}))
}

const sendMessage =(text)=> {
  if (text.length > 0) {
    setMessageList([...messageList,{author: 'them', type: 'text', data: {text}}])
  }
}

const ws = new Sockette('wss://2npwkbjlba.execute-api.us-east-1.amazonaws.com/dev', {
  timeout: 5e3,
  maxAttempts: 10,
  onopen: e => console.log('Connected!', e),
  onmessage: e => {
    setMessageList([...messageList, {author: 'them', type: 'text', data: e.data}])
    console.log('Received:', e.data )},
  onreconnect: e => console.log('Reconnecting...', e),
  onmaximum: e => console.log('Stop Attempting!', e),
  onclose: e => console.log('Closed!', e),
  onerror: e => console.log('Error:', e)
})


// Reconnect 10s later

setTimeout(ws.reconnect, 10e3);

return(<div>
  <Launcher
    agentProfile={{
      teamName: 'react-chat-window',
      imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
    }}
    onMessageWasSent={onMessageWasSent}
    messageList={messageList}
  />
</div>)
}
export default ChatWindow