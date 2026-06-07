from fastapi import HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.supabase_client import supabase_client

auth_scheme = HTTPBearer()

async def get_current_user(auth: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    """
    Validates the Bearer token against Supabase and returns the user object.
    """
    token = auth.credentials
    try:
        res = supabase_client.auth.get_user(token)
        if not res or not res.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token"
            )
        return res.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}"
        )

async def get_optional_user(request: Request):
    """
    Manually checks for a Bearer token in the headers.
    Returns user if valid, otherwise None.
    Does NOT raise 401.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ")[1]
    try:
        res = supabase_client.auth.get_user(token)
        if res and res.user:
            return res.user
    except:
        pass
    return None
