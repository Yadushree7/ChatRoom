import React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import styled from "styled-components";

const ScrollableDiv = styled.div`
  width: 300px;
  height: 400px;
  overflow-y: scroll;
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    border-radius: 10px;
    border: 2px solidrgb(43, 43, 43);
  }

  &::-webkit-scrollbar-track {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    border-radius: 10px;
  }
`;

function Room({ username, room, socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // To keep track of users in the room
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // ✅ Define sendMessage
  const sendMessage = () => {
    if (message.trim() !== "") {
      // const timestamp = new Date().toLocaleTimeString();
      socket.emit("message", { username, message, room, time: Date.now() });
      setMessage("");
    } else {
      alert("Please enter a message to send.");
    }
  };

  useEffect(() => {
    const handleJoin = (data) => {
      console.log("Expected room:", room);
      console.log("Received event room:", data.room);
      if (data.room === room) {
        console.log("User joined:", data.users);
        setUsers(data.users);
        setMessages((prev) => [
          ...prev,
          {
            username: "Server❗",
            message: data.message,
            // time: new Date().toLocaleTimeString(),
            time: Date.now(),
          },
        ]);
      }
    };

    const handleLeave = (data) => {
      if (data.room === room) {
        setUsers(data.users);
        setMessages((prev) => [
          ...prev,
          {
            username: "Server❗",
            message: data.message,
            // time: new Date().toLocaleTimeString(),
            time: Date.now(),
          },
        ]);
      }
    };

    const handleDisconnect = (data) => {
      if (data.room === room) {
        setUsers(data.users);
        setMessages((prev) => [
          ...prev,
          {
            username: "Server❗",
            message: data.message,
            time: new Date.now(),
          },
        ]);
      }
    };

    const handleMessage = (msg) => {
      if (msg.room === room) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...msg,
            time: Date.now(),
          },
        ]);
      }
    };

    const handleUnload = () => {
      socket.emit("leave", { username, room });
    };

    // Attach event listeners
    socket.on("joined", handleJoin);
    socket.on("left", handleLeave);
    socket.on("disconnect", handleDisconnect);
    socket.on("message", handleMessage);
    window.addEventListener("beforeunload", handleUnload); // Detects refresh/close

    // Cleanup event listeners on unmount
    return () => {
      socket.off("joined", handleJoin);
      socket.off("left", handleLeave);
      socket.off("disconnect", handleDisconnect);
      socket.off("message", handleMessage);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [room, socket]);

  return (
    <div>
      <ScrollableDiv
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // border: "1px solid black",
          width: "900px",
          height: "540px",
          position: "absolute",
          bottom: "90px",
          right: "20px",
          borderRadius: "10px",
          overflowY: "scroll",
          backgroundColor: "#3b3b3b",
          boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.7)",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.username === username ? "flex-end" : "flex-start",
              backgroundColor: "#2b2b2b",
              borderRadius: "10px",
              wordWrap: "break-word", // Ensures long words break onto the next line
              overflowWrap: "break-word", // Additional support for older browsers
              whiteSpace: "pre-wrap",
              margin: "5px",
              padding: "10px",
              marginTop: "20px",
              marginRight: "10px",
              minWidth: "40px",
              maxWidth: "70%",
              boxShadow: "4px 4px 8px rgb(26, 25, 25, 0.7)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection:
                  msg.username === username ? "row-reverse" : "row",
                alignItems:
                  msg.username === username ? "flex-end" : "flex-start",
                gap: "8px", // Adds space between elements
                width: "100%", // Ensures full width usage
              }}
            >
              {/* Avatar: Stays Fixed */}
              <img
                src={`https://robohash.org/${msg.username}?set=set4`}
                alt="avatar"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  alignItems:
                    msg.username === username ? "flex-end" : "flex-start",
                }}
              />

              {/* Name & Time Container: Stays Fixed */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    msg.username === username ? "flex-end" : "flex-start",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#ffffff",
                  }}
                >
                  {msg.username === username ? "You" : msg.username}
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: "#999",
                    margin: 0,
                  }}
                >
                  {new Date(msg.time).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <p
              style={{
                marginTop: "15px",
                marginBottom: "0",
                textAlign: msg.username === username ? "right" : "left",
              }}
            >
              {msg.message}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollableDiv>
      <textarea
        style={{
          width: "900px",
          height: "15px",
          borderRadius: "10px",
          border: "none",
          padding: "15px",
          position: "absolute",
          bottom: "30px",
          right: "10px",
          outline: "none",
          backgroundColor: "black",
          boxShadow: "4px 4px 8px rgba(78, 78, 78, 0.5)",
        }}
        placeholder="Enter Text Here..."
        type="text"
        value={message}
        onChange={handleMessageChange}
      ></textarea>
      <button
        style={{
          width: "50px",
          padding: "11px",
          position: "absolute",
          bottom: "30px",
          right: "10px",
          color: "#ffffff",
          outline: "none",
          backgroundColor: "#000000",
        }}
        onClick={sendMessage}
      >
        <IoMdSend />
      </button>

      <div
        style={{
          // border: "1px solid black",
          width: "400px",
          height: "620px",
          position: "absolute",
          bottom: "30px",
          left: "10px",
          borderRadius: "10px",
          backgroundColor: "#3b3b3b",
          boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.7)",
        }}
      >
        <div
          style={{
            border: "1px solid black",
            width: "365px",
            height: "30px",
            position: "absolute",
            top: "10PX",
            left: "5px",
            borderRadius: "10px",
            textAlign: "left",
            padding: "10px",
            backgroundColor: "#000000",
            color: "#ffffff",
          }}
        >
          Room ID: {room}
        </div>
        <ScrollableDiv
          style={{
            position: "absolute",
            left: "40px",
            top: "90px",
            height: "420px",
            borderRadius: "10px",
            overflowY: "scroll",
            backgroundColor: "#3b3b3b",
            boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.7)",
          }}
        >
          <div style={{ padding: "10px", color: "black" }}>
            <h4 style={{ color: "black", textAlign: "center" }}>
              Online Members
            </h4>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {users.map((user, index) => (
                <li
                  key={index}
                  style={{
                    padding: "8px",
                    backgroundColor: "#2b2b2b",
                    margin: "5px 0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`https://robohash.org/${user}?set=set4`}
                    alt="avatar"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  {user}
                </li>
              ))}
            </ul>
          </div>
        </ScrollableDiv>
        <button
          style={{
            width: "125px",
            padding: "11px",
            position: "absolute",
            bottom: "0",
            right: "0",
            margin: "5px",
            color: "#ffffff",
            outline: "none",
            backgroundColor: "#000000",
          }}
          onClick={() => setMessages([])}
        >
          x
        </button>
        <button
          style={{
            width: "125px",
            padding: "11px",
            position: "absolute",
            bottom: "0",
            left: "132px",
            margin: "5px",
            color: "#ffffff",
            outline: "none",
            backgroundColor: "#000000",
          }}
          onClick={() => navigator.clipboard.writeText(room)}
        >
          <FaCopy />
        </button>
        <button
          style={{
            width: "125px",
            padding: "11px",
            position: "absolute",
            bottom: "0",
            left: "0",
            margin: "5px",
            color: "#ffffff",
            outline: "none",
            backgroundColor: "#000000",
          }}
          onClick={() => {
            socket.emit("leave", { username, room });
            navigate("/");
          }}
        >
          <IoIosLogOut />
        </button>
      </div>
    </div>
  );
}

export default Room;
