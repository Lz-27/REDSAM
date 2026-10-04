from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Nombre completo")
    email: EmailStr = Field(..., description="Correo electrónico")
    phone: Optional[str] = Field(None, max_length=30, description="Teléfono / WhatsApp (opcional)")
    interest: Optional[str] = Field(None, max_length=150, description="Área de interés")
    message: str = Field(..., min_length=5, max_length=1200, description="Mensaje")
    activity: Optional[str] = Field(None, max_length=200, description="Actividad de interés (opcional)")


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    interest: Optional[str]
    message: str
    activity: Optional[str]
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
