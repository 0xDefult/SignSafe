from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, timedelta
import secrets
import uuid
from models.schemas import Team, TeamMember, Invitation, InvitationRequest, JoinRequest, TeamRole, TeamStatus
from services.auth import get_current_user
from services.supabase_client import supabase_client

router = APIRouter(prefix="/teams", tags=["teams"])

@router.post("/", response_model=Team)
async def create_team(name: str, user=Depends(get_current_user)):
    try:
        data = {
            "name": name,
            "owner_id": user.id,
            "created_at": datetime.utcnow().isoformat()
        }
        res = supabase_client.table("teams").insert(data).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create team")

        team = res.data[0]

        # Add owner as ADMIN member
        supabase_client.table("team_members").insert({
            "team_id": team["id"],
            "user_id": user.id,
            "role": "ADMIN"
        }).execute()

        return team
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=List[Team])
async def get_my_teams(user=Depends(get_current_user)):
    try:
        # Join team_members to get teams the user belongs to
        res = supabase_client.table("teams").select("*, team_members!inner(user_id)").eq("team_members.user_id", user.id).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{team_id}/members", response_model=List[TeamMember])
async def get_team_members(team_id: str, user=Depends(get_current_user)):
    try:
        # Verify user is in team
        member = supabase_client.table("team_members").select("*").eq("team_id", team_id).eq("user_id", user.id).execute()
        if not member.data:
            raise HTTPException(status_code=403, detail="Not a member of this team")

        res = supabase_client.table("team_members").select("*").eq("team_id", team_id).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{team_id}/invites", response_model=Invitation)
async def invite_member(team_id: str, req: InvitationRequest, user=Depends(get_current_user)):
    try:
        # Verify user is ADMIN
        member = supabase_client.table("team_members").select("role").eq("team_id", team_id).eq("user_id", user.id).single().execute()
        if not member.data or member.data.get("role") != "ADMIN":
            raise HTTPException(status_code=403, detail="Only admins can invite members")

        token = secrets.token_urlsafe(32)
        expires_at = (datetime.utcnow() + timedelta(days=7)).isoformat()

        invitation = {
            "team_id": team_id,
            "email": req.email,
            "name": req.name,
            "role": req.role,
            "token": token,
            "invited_by": user.id,
            "status": "PENDING",
            "expires_at": expires_at
        }

        res = supabase_client.table("invitations").insert(invitation).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create invitation")

        # TODO: Integrate email service to send the invite link
        # print(f"Sending invite to {req.email}: https://signsafe.app/team/join?token={token}")

        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{team_id}/members/{user_id}")
async def update_member_role(team_id: str, user_id: str, role: TeamRole, user=Depends(get_current_user)):
    try:
        # Verify requester is ADMIN
        requester = supabase_client.table("team_members").select("role").eq("team_id", team_id).eq("user_id", user.id).single().execute()
        if not requester.data or requester.data.get("role") != "ADMIN":
            raise HTTPException(status_code=403, detail="Only admins can change roles")

        res = supabase_client.table("team_members").update({"role": role}).eq("team_id", team_id).eq("user_id", user_id).execute()
        return {"message": "Role updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{team_id}/members/{user_id}")
async def remove_member(team_id: str, user_id: str, user=Depends(get_current_user)):
    try:
        # Verify requester is ADMIN
        requester = supabase_client.table("team_members").select("role").eq("team_id", team_id).eq("user_id", user.id).single().execute()
        if not requester.data or requester.data.get("role") != "ADMIN":
            raise HTTPException(status_code=403, detail="Only admins can remove members")

        # Prevent removing yourself (unless you transfer ownership)
        if user.id == user_id:
            raise HTTPException(status_code=400, detail="You cannot remove yourself from the team")

        supabase_client.table("team_members").delete().eq("team_id", team_id).eq("user_id", user_id).execute()
        return {"message": "Member removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/join")
async def join_team(req: JoinRequest, user=Depends(get_current_user)):
    try:
        # Validate token
        invitation = supabase_client.table("invitations").select("*").eq("token", req.token).single().execute()
        if not invitation.data:
            raise HTTPException(status_code=404, detail="Invitation not found")

        inv = invitation.data
        if inv["status"] != "PENDING":
            raise HTTPException(status_code=400, detail="Invitation already used or expired")

        if datetime.utcnow() > datetime.fromisoformat(inv["expires_at"]):
            raise HTTPException(status_code=400, detail="Invitation has expired")

        # Add user to team
        supabase_client.table("team_members").insert({
            "team_id": inv["team_id"],
            "user_id": user.id,
            "role": inv["role"]
        }).execute()

        # Update invitation status
        supabase_client.table("invitations").update({"status": "ACCEPTED"}).eq("id", inv["id"]).execute()

        return {"message": "Successfully joined the team"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
