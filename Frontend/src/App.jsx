import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Lobby from "./components/Lobby";
import Room from "./components/Room";
import io from "socket.io-client";

let endPoint = "https://chatroom-2-gc4l.onrender.com";
let socket = io.connect(`${endPoint}`);

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Lobby
                setUsername={setUsername}
                setRoom={setRoom}
                setJoined={setJoined}
                socket={socket}
              />
            }
          />
          <Route
            path="/room"
            element={
              joined ? (
                <Room username={username} room={room} socket={socket} />
              ) : (
                <div>Please Join room</div>
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
