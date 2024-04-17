import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './style.css'; // Import your CSS file

const ChatBot = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    const name = "Harsh";
    if (name) setUsername(name);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on('user-connected', (user) => {
      setMessages(prevMessages => [...prevMessages, { user, msg: 'joined' }]);
    });

    socket?.on('user-disconnected', (user) => {
      setMessages(prevMessages => [...prevMessages, { user, msg: 'left' }]);
    });

    socket?.on('message', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });
  }, [socket]);

  const sendMessage = () => {
    const message = document.getElementById("user-msg").value;
    if (message) {
      const data = { user: username, msg: message };
      socket.emit('message', data);
      setMessages(prevMessages => [...prevMessages, data]);
      document.getElementById("user-msg").value = '';
    }
  };
  console.log(messages)

  return (
    <main className="main">
      <header>
        <div className="title">
          <h1>AI Assistance</h1>
        </div>
      </header>

      <div className="container">
        <div className="chat-window">
          <div className="chats">
            {messages.map((message, index) => (
              <div key={index}>
                <div className="outgoing">
                <h5>{message.user}</h5>
                <p>{message.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="user-input">
            <input id="user-msg" type="text" placeholder="Type your message..." />
            <button type="button" id="user-send" onClick={sendMessage}>SEND</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatBot;
