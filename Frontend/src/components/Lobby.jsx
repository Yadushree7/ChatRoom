// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function Lobby({ setUsername, setRoom, setJoined, socket }) {
//   const [localUsername, setLocalUsername] = useState("");
//   const [localRoom, setLocalRoom] = useState("");
//   const navigate = useNavigate();

//   // const socket = io.connect("http://127.0.0.1:5000");

//   const fetchRoomID = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("https://chatroom-2-gc4l.onrender.com/room-id");
//       const data = await response.json();

//       if (data.RoomID && data.RoomID.length >= 10) {
//         console.log("Generated Room ID:", data.RoomID); // Debugging
//         setLocalRoom(data.RoomID); // ✅ Updates input field correctly
//       } else {
//         console.error("Invalid Room ID received:", data.RoomID);
//       }
//     } catch (error) {
//       console.error("Error fetching Room ID:", error);
//     }
//   };

//   const handleUsernameChange = (e) => {
//     setLocalUsername(e.target.value);
//   };

//   const handleRoomChange = (e) => {
//     setLocalRoom(e.target.value);
//   };

//   const joinRoom = () => {
//     // e.preventDefault();
//     if (localUsername !== "" && localRoom !== "" && localRoom.length > 10) {
//       setUsername(localUsername);
//       setRoom(localRoom);
//       setJoined(true);
//       socket.emit("join", { username: localUsername, room: localRoom });
//       console.log("Navigating to room with", localUsername, localRoom);
//       navigate("/room");
//     } else {
//       alert("Please enter details Room ID should be 10 or more characters!");
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: "10px",
//         width: "300px",
//       }}
//     >
//       <h1 style={{ color: "#000000" }}>Welcome!</h1>
//       <input
//         value={localRoom}
//         onChange={handleRoomChange}
//         placeholder="Room ID"
//         style={{
//           width: "300px",
//           borderRadius: "5px",
//           border: "none",
//           padding: "15px",
//         }}
//       ></input>
//       <input
//         value={localUsername}
//         name="username"
//         onChange={handleUsernameChange}
//         placeholder="UserName"
//         style={{
//           width: "300px",
//           borderRadius: "5px",
//           border: "none",
//           padding: "15px",
//         }}
//       ></input>
//       <button
//         name="join"
//         type="submit"
//         style={{
//           width: "330px",
//           borderRadius: "5px",
//           border: "none",
//           backgroundColor: "#000000",
//           outline: "none",
//         }}
//         onClick={joinRoom}
//       >
//         Join
//       </button>
//       <a href="#" onClick={fetchRoomID} style={{ color: "black" }}>
//         Generate Unique Room ID
//       </a>
//     </div>
//   );
// }

// export default Lobby;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Room.css"; // ✅ reuse same gradient + styles

function Lobby({ setUsername, setRoom, setJoined, socket }) {
  const [localUsername, setLocalUsername] = useState("");
  const [localRoom, setLocalRoom] = useState("");
  const navigate = useNavigate();

  const fetchRoomID = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://chatroom-2-gc4l.onrender.com/room-id");
      const data = await response.json();
      if (data.RoomID && data.RoomID.length >= 10) {
        setLocalRoom(data.RoomID);
      } else {
        alert("Invalid Room ID received. Try again.");
      }
    } catch (error) {
      console.error("Error fetching Room ID:", error);
    }
  };

  const joinRoom = () => {
    if (localUsername !== "" && localRoom !== "" && localRoom.length >= 10) {
      setUsername(localUsername);
      setRoom(localRoom);
      setJoined(true);
      socket.emit("join", { username: localUsername, room: localRoom });
      navigate("/room");
    } else {
      alert("Please enter details. Room ID should be at least 10 characters!");
    }
  };

  return (
    <div className="room-bg">
      <div
        style={{
          width: "480px",
          height: "420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "20px",
          background: "rgba(250,234,246,0.15)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 25px rgba(98,40,114,0.4)",
          color: "#622872",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "20px",
            color: "#622872",
          }}
        >
          Welcome to ChatRoom 💬
        </h1>

        <input
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          placeholder="Enter Username"
          style={{
            width: "90%",
            borderRadius: "10px",
            border: "none",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "rgba(250,234,246,0.6)",
            color: "#622872",
            boxShadow: "0 0 10px rgba(98,40,114,0.3)",
            outline: "none",
            fontSize: "14px",
          }}
        />

        <input
          value={localRoom}
          onChange={(e) => setLocalRoom(e.target.value)}
          placeholder="Enter Room ID"
          style={{
            width: "90%",
            borderRadius: "10px",
            border: "none",
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "rgba(250,234,246,0.6)",
            color: "#622872",
            boxShadow: "0 0 10px rgba(98,40,114,0.3)",
            outline: "none",
            fontSize: "14px",
          }}
        />

        <button
          onClick={joinRoom}
          style={{
            width: "94%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#622872",
            color: "#faeaf6",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
            marginBottom: "15px",
          }}
        >
          Join Room 🚀
        </button>

        <a
          href="#"
          onClick={fetchRoomID}
          style={{
            color: "#622872",
            fontWeight: "bold",
            textDecoration: "none",
            fontSize: "13px",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#9b6aa3")}
          onMouseOut={(e) => (e.target.style.color = "#622872")}
        >
          Generate Unique Room ID 🔑
        </a>
      </div>
    </div>
  );
}

export default Lobby;
