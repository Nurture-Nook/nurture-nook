from fastapi import FastAPI
from middleware.auth import auth_middleware
from middleware.logging import log_requests
from middleware.rate_limit import rate_limit_middleware
from middleware.cors import setup_cors
from db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

setup_cors(app)

app.middleware("http")(auth_middleware)
app.middleware("http")(log_requests)
app.middleware("http")(rate_limit_middleware)
