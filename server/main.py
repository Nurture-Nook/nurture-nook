from fastapi import FastAPI
from .middleware.auth import auth_middleware
from .middleware.logger_middleware import log_requests
from .middleware.rate_limit import rate_limit_middleware
from .middleware.cors import setup_cors
from .routes import auth, category, chat, comment, message, post, user, warning
from .db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

setup_cors(app)

app.middleware("http")(auth_middleware)
app.middleware("http")(log_requests)
app.middleware("http")(rate_limit_middleware)

@app.get("/")
def root():
    return {"message": "Server is running!"}

app.include_router(auth.router)
app.include_router(category.router)
app.include_router(chat.router)
app.include_router(comment.router)
app.include_router(message.router)
app.include_router(post.router)
app.include_router(user.router)
app.include_router(warning.router)
