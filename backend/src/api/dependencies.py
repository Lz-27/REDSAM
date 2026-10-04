from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError
from src.core.config import settings
from src.core.exceptions import UnauthorizedException
from src.db.session import get_db
from src.schemas.token import TokenPayload
from src.services.user import get_user_by_email
from src.db.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        if token_data.sub is None:
            raise UnauthorizedException(detail="Token inválido")
    except JWTError:
        raise UnauthorizedException(detail="No se pudo validar el token")
    
    user = await get_user_by_email(db, email=token_data.sub)
    if not user:
        raise UnauthorizedException(detail="El usuario no existe")
    if not user.is_active:
        raise UnauthorizedException(detail="El usuario está inactivo")
    return user

async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise UnauthorizedException(detail="El usuario no tiene suficientes privilegios")
    return current_user
