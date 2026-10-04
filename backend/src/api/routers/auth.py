from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_db
from src.core.security import verify_password, create_access_token
from src.core.exceptions import UnauthorizedException
from src.schemas.token import Token
from src.services.user import get_user_by_email

#Instanciamos Nuestro Router
router = APIRouter()

@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Token:
    """
    OAuth2 compatible token login, obtén un token de acceso para llamadas futuras.
    """
    user = await get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise UnauthorizedException(detail="Correo o contraseña incorrectos")
    elif not user.is_active:
        raise UnauthorizedException(detail="El usuario está inactivo")
    
    #Generamos el token
    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token, token_type="bearer")
