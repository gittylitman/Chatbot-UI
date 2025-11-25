<<<<<<< HEAD
from fastapi import FastAPI, APIRouter
=======
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
>>>>>>> cffc693c05a87964a66d2f19144781d5abf38a06
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


dummy_contents = [
    "Hello! How can I help you today?",
    "Sure, I can explain that. Here's a simple example.",
    "Absolutely! Here's a list example in Markdown:\n- Apples\n- Oranges\n- Bananas",
    "Thanks for your question! Let me show you a code snippet:\n```python\nprint('Hello, world!')\n```",
    "Interesting question! Here's a detailed explanation...",
    "Here's another code example in TypeScript:\n```ts\nfunction greet(name: string) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet('Lea'))\n```",
    "Here's a simple table in Markdown:\n| Name    | Age | Role     |\n|---------|-----|----------|\n| Lea     | 30  | User     |\n| ChatGPT | N/A | Assistant|",
    "Here is a numbered list in Markdown:\n1. Learn TypeScript basics\n2. Practice with small projects\n3. Explore advanced concepts like generics\n\nAnd a bullet list:\n- Apples\n- Oranges\n- Bananas",
    "Quick tip: Remember to always sanitize user input to prevent security issues.",
    "Here’s a Markdown table with scores:\n| Player | Score |\n|--------|-------|\n| Alice  | 85    |\n| Bob    | 92    |",
    "Code snippet for summing numbers:\n```javascript\nconst sum = (a, b) => a + b;\nconsole.log(sum(5, 7));\n```",
    "Bullet list example:\n- First item\n- Second item\n- Third item",
    "Numbered steps to create a project:\n1. Initialize repository\n2. Install dependencies\n3. Start coding",
    "Another code snippet in Python:\n```python\ndef factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)\nprint(factorial(5))\n```",
    "Simple Markdown table with products:\n| Product | Price |\n|---------|-------|\n| Pen     | $1    |\n| Notebook| $3    |",
    "Tips for clean code:\n- Use meaningful variable names\n- Write small functions\n- Keep code DRY",
    "Advanced example combining code and lists:\n- **Code**:\n```ts\nlet numbers = [1,2,3];\nnumbers.map(n => n * 2);\n```\n- **List**:\n- Double the numbers\n- Print results",
    "Markdown list with nested items:\n- Fruits\n  - Apple\n  - Banana\n- Vegetables\n  - Carrot\n  - Broccoli",
    "Final tip: Practice regularly and review your code to improve continuously."
]


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


@app.post("/session/{session_id}/message")
async def send_message(session_id: str, message: dict):
    await asyncio.sleep(5)
    content = random.choice(dummy_contents)

    return {
            "type": "message",
            "content": content,
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
