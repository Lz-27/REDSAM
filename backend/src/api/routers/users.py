from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_db
from src.schemas.user import UserCreate, UserResponse
from src.services.user import create_user, get_user_by_email
from src.core.exceptions import BadRequestException
from src.api.dependencies import get_current_active_superuser

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_new_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_active_superuser)
):
    """
    Crea un nuevo usuario (solo para superusuarios).
    """
    user = await get_user_by_email(db, email=user_in.email)
    if user:
        raise BadRequestException(detail="El usuario con este correo electrónico ya existe en el sistema.")
    user = await create_user(db=db, user_in=user_in)
    return user
