import os
from typing import Any, Dict
from urllib.parse import parse_qs, urlparse

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


def _safe_upstream_error(phase: str, status_code: int) -> HTTPException:
    return HTTPException(
        status_code=502,
        detail=f"Bot2 upstream error during {phase} phase (status {status_code})",
    )


def _build_regional_settings_url(token_endpoint: str) -> str:
    marker = "/powervirtualagents"
    marker_index = token_endpoint.find(marker)
    if marker_index <= 0:
        raise ValueError("BOT2_TOKEN_ENDPOINT must contain '/powervirtualagents'")

    environment_endpoint = token_endpoint[:marker_index].rstrip("/")
    parsed = urlparse(token_endpoint)
    api_version = parse_qs(parsed.query).get("api-version", [None])[0]
    if not api_version:
        raise ValueError("BOT2_TOKEN_ENDPOINT must include api-version query parameter")

    return (
        f"{environment_endpoint}/powervirtualagents/regionalchannelsettings"
        f"?api-version={api_version}"
    )


def _normalize_directline_domain(base_url: str) -> str:
    return f"{base_url.rstrip('/')}/v3/directline"


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


@app.post("/api/bot2/session")
async def bot2_session(payload: TokenRequest | None = None) -> Dict[str, Any]:
    upstream_endpoint = os.getenv("BOT2_TOKEN_ENDPOINT")
    if not upstream_endpoint:
        raise HTTPException(status_code=500, detail="Backend token proxy is not configured")

    timeout_seconds = float(os.getenv("BOT2_TOKEN_TIMEOUT_SECONDS", "10"))

    try:
        regional_settings_url = _build_regional_settings_url(upstream_endpoint)
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    try:
        async with httpx.AsyncClient(timeout=timeout_seconds) as client:
            regional_response = await client.get(regional_settings_url)
            if regional_response.status_code >= 400:
                raise _safe_upstream_error("regional", regional_response.status_code)

            regional_data = regional_response.json()
            directline_base = (
                regional_data.get("channelUrlsById", {}).get("directline")
                if isinstance(regional_data, dict)
                else None
            )
            if not directline_base:
                raise HTTPException(
                    status_code=502,
                    detail="Bot2 upstream error during regional phase (missing directline URL)",
                )

            if payload and payload.user_id:
                token_response = await client.post(
                    upstream_endpoint,
                    json={"userId": payload.user_id},
                )
            else:
                token_response = await client.post(upstream_endpoint)

            if token_response.status_code >= 400:
                raise _safe_upstream_error("token", token_response.status_code)

        token_data = token_response.json()
        sanitized = TokenResponse(
            token=token_data.get("token") or token_data.get("Token"),
            conversationId=token_data.get("conversationId"),
            expires_in=token_data.get("expires_in"),
            domain=_normalize_directline_domain(directline_base),
        )
        return sanitized.model_dump(exclude_none=True)

    except HTTPException:
        raise
    except (httpx.HTTPError, ValueError, ValidationError):
        raise HTTPException(status_code=502, detail="Bot2 session bootstrap unavailable")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/api/bot2/token")
async def bot2_token(payload: TokenRequest | None = None) -> Dict[str, Any]:
    upstream_endpoint = os.getenv("BOT2_TOKEN_ENDPOINT")
    if not upstream_endpoint:
        raise HTTPException(status_code=500, detail="Backend token proxy is not configured")

    timeout_seconds = float(os.getenv("BOT2_TOKEN_TIMEOUT_SECONDS", "10"))

    try:
        async with httpx.AsyncClient(timeout=timeout_seconds) as client:
            if payload and payload.user_id:
                response = await client.post(upstream_endpoint, json={"userId": payload.user_id})
            else:
                response = await client.post(upstream_endpoint)

        if response.status_code >= 400:
            raise _safe_upstream_error("token", response.status_code)

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
