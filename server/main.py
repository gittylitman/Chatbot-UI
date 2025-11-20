from fastapi import FastAPI
from datetime import datetime
import uuid

app = FastAPI()


def current_time():
    return datetime.utcnow().isoformat() + "Z"


def mock_session(user_id: str):
    return {
        "id": f"session_{uuid.uuid4().hex}",
        "userId": user_id,
        "createdAt": current_time(),
        "updatedAt": current_time()
    }


def mock_message(session_id: str, role: str, content: str, action=None, type=None):
    return {
        "id": f"message_{uuid.uuid4().hex}",
        "sessionId": session_id,
        "role": role,
        "content": content,
        "type": type,
        "action": action,
        "createdAt": current_time(),
        "choices": [],
        "dataItems": []
    }


@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.post("/session/{user_id}")
def create_session(user_id: str):
    session = mock_session(user_id)
    return session


@app.get("/session/{session_id}")
def get_session(session_id: str):
    session = mock_session("mock")
    session["messages"] = [
        mock_message(session["id"], "user", "Hello, I need you"),
        mock_message(
            session["id"], "agent", "This is a stub response from the agent", action="end", type="message")
    ]
    return session


@app.post("/session/{session_id}/message")
def send_message(session_id: str, message: dict):
    return {
        "type": "message",
        "content": "This is a stub response from the agent",
        "action": "end"
    }


@app.get("/user/{user_id}/history")
def user_history(user_id: str):
    session = mock_session(user_id)
    session["messages"] = [
        mock_message(session["id"], "user", "Hello, I need you"),
        mock_message(
            session["id"], "agent", "This is a stub response from the agent", action="end", type="message")
    ]
    return [session, session]


@app.delete("/session/{session_id}")
def delete_session(session_id: str):
    session = mock_session("mock")
    session["deletedAt"] = current_time()
    return session
