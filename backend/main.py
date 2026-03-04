import os
from typing import Any, Dict

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError


class TokenRequest(BaseModel):
    user_id: str | None = None


class TokenResponse(BaseModel):
    token: str
    conversationId: str | None = None
    expires_in: int | None = None
    domain: str | None = None


app = FastAPI(title="Career Copilot Bot2 Backend", version="1.0.0")


def _parse_cors_origins() -> list[str]:
    raw = os.getenv("BACKEND_CORS_ORIGINS", "")
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


cors_origins = _parse_cors_origins()
if cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/bot2/token")
async def bot2_token(payload: TokenRequest | None = None) -> Dict[str, Any]:
    upstream_endpoint = os.getenv("BOT2_TOKEN_ENDPOINT")
    if not upstream_endpoint:
        raise HTTPException(status_code=500, detail="Backend token proxy is not configured")

    timeout_seconds = float(os.getenv("BOT2_TOKEN_TIMEOUT_SECONDS", "10"))

    upstream_payload: Dict[str, Any] = {}
    if payload and payload.user_id:
        upstream_payload["userId"] = payload.user_id

    try:
        async with httpx.AsyncClient(timeout=timeout_seconds) as client:
            response = await client.post(upstream_endpoint, json=upstream_payload)

        if response.status_code >= 400:
            raise HTTPException(status_code=502, detail="Token upstream request failed")

        data = response.json()
        sanitized = TokenResponse(
            token=data.get("token") or data.get("Token"),
            conversationId=data.get("conversationId"),
            expires_in=data.get("expires_in"),
            domain=data.get("domain"),
        )
        return sanitized.model_dump(exclude_none=True)

    except HTTPException:
        raise
    except (httpx.HTTPError, ValueError, ValidationError):
        raise HTTPException(status_code=502, detail="Token service unavailable")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
