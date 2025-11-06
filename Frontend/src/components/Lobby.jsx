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

