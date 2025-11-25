from fastapi import FastAPI, APIRouter
from datetime import datetime
import uuid
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
router = APIRouter(prefix="/api/chat")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@router.get("/ping")
def ping():
    return {"message": "pong"}


@router.post("/session/{user_id}")
def create_session(user_id: str):
    session = mock_session(user_id)
    return session


@router.get("/session/{session_id}")
def get_session(session_id: str):
    session = mock_session("mock")
    session["messages"] = [
        mock_message(session["id"], "user", "Hello, I need you"),
        mock_message(
            session["id"], "agent", "This is a stub response", action="end", type="message")
    ]
    return session


@router.post("/session/{session_id}/message")
def send_message(session_id: str, message: dict):
    return {
        "type": "message",
        "content": "This is a stub response from the agent",
        "action": "end"
    }


@router.get("/user/{user_id}/history")
def user_history(user_id: str):
    session = mock_session(user_id)
    session["messages"] = [
        mock_message(session["id"], "user", "Hello, I need you"),
        mock_message(
            session["id"], "agent", "This is a stub response", action="end", type="message")
    ]
    return [session, session]


@router.delete("/session/{session_id}")
def delete_session(session_id: str):
    print("Deleting session:", session_id)
    session = mock_session("mock")
    session["deletedAt"] = current_time()
    return session


app.include_router(router)
