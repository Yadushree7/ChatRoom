from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_cors import CORS
import uuid
from datetime import datetime
import os
import eventlet
eventlet.monkey_patch()


app = Flask(__name__,static_folder="../Frontend/dist",static_url_path="/")
app.config['SECRET_KEY'] = 'secret!'



CORS(app,resources={r"/*":{"origins":"*"}})
socketIo = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

app.debug =True
app.host='localhost'


rooms = {}



@app.route('/room-id')
def generate_unique_id():
    unique_id = str(uuid.uuid4()).replace("-", "")[:12]  # Ensure at least 10 characters
    return jsonify({"RoomID": unique_id})

    

# @app.route("/")
# def index():
#     return "Chat server is running."

@socketIo.on("join")
def handle_join(data):
    username = data.get("username")
    room = data.get("room")

    if not username or not room:
        # print("⚠️ Missing username or room in join request!")
        emit("error", {"message": "Username and room are required to join."})
        return
    
    # print(f"✅ {username} is joining room {room}")  # Debugging print
    

    join_room(room)

    if room not in rooms:
        rooms[room] = []

    if username not in rooms[room]:  # Prevent duplicate users
        rooms[room].append(username)
    
    print(f"Users in {room}: {rooms[room]}") 

    # Emit updated user list
    emit("joined", {
        "message": f"{username} has joined room {room}.",
        "room": room,
        "users": rooms[room]  # Updated users
    }, room=room)


@socketIo.on("leave")
def handle_leave(data):
    username = data.get("username")
    room = data.get("room")


   
    if room in rooms and username in rooms[room]:
        rooms[room].remove(username)  # Remove user from list
        leave_room(room)

        # Notify other users
        emit("left", {
            "username": "Server",
            "message": f"{username} has left the room.",
            "room": room,
            "users": rooms[room]  # Updated users
        }, room=room)

        # Remove empty room
        if not rooms[room]:
            del rooms[room]

@socketIo.on("message")
def handle_message(data):
    username = data.get("username")
    message = data.get("message")
    room = data.get("room")

    data["time"] = datetime.now().strftime("%H:%M:%S") 

    if username and message and room:
        emit("message", {"username": username, "message": message, "room": room}, broadcast=True)
    else:
        emit("error", {"message": "Message and username are required."})


@socketIo.on("disconnect")
def handle_disconnect():
    for room, users in rooms.items():
        for username in users:
            if request.sid in users:  # Check if this user's session ID exists
                users.remove(username)
                emit("left", {
                    "message": f"{username} has disconnected.",
                    "room": room,
                    "users": users
                }, room=room)
                break


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


# if __name__ == "__main__":
#     socketIo.run(app)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    socketIo.run(app, host='0.0.0.0', port=port)
