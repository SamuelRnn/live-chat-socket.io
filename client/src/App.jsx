import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001");
const App = () => {
  const [msg, setMsg] = useState({
    text: "",
    user: "",
  });
  const [messageRecord, setMessageRecord] = useState([]);

  useEffect(() => {
    const recieveMsg = (msg) => setMessageRecord((state) => [...state, msg]);
    socket.on("message", recieveMsg);
    return () => {
      socket.off("message", recieveMsg);
    };
  }, []);

  const sendMsg = (e) => {
    e.preventDefault();
    if (!msg.text.length || !msg.user.length) return;

    socket.emit("message", msg);
    setMessageRecord((state) => [...state, msg]);
    setMsg((state) => ({ ...state, text: "" }));
  };
  return (
    <div className="wrapper">
      <div className="chat">
        <input
          className="name"
          type="text"
          placeholder="author"
          onChange={({ target }) =>
            setMsg((state) => ({ ...state, user: target.value }))
          }
        />
        <div className="messages">
          {messageRecord.map((message) => {
            if (message.user === msg.user) {
              return <p className="own">{message.text}</p>;
            } else {
              return (
                <p className="other">
                  {message.user}: {message.text}
                </p>
              );
            }
          })}
        </div>
        <form onSubmit={sendMsg}>
          <input
            className="textbox"
            placeholder="send messages"
            type="text"
            onChange={({ target }) =>
              setMsg((state) => ({ ...state, text: target.value }))
            }
            value={msg.text}
          />
          <button type="submit" className="send">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
