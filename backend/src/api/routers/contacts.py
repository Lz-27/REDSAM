from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from typing import List
from src.db.session import get_db
from src.schemas.contact import ContactCreate, ContactResponse
from src.services.contact import (
    create_contact,
    get_contacts,
    get_contact,
    mark_contact_as_read,
    delete_contact,
)
from src.api.dependencies import get_current_user
from src.core.exceptions import NotFoundException, BadRequestException
from src.db.models import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def send_confirmation_email(email: str, name: str) -> None:
    """
    Tarea en segundo plano: envía correo de confirmación al usuario.
    TODO: Reemplazar el print por integración con Resend, SendGrid o smtplib.
    """
    logger.info(f"[EMAIL] Enviando confirmacion a {email} ({name})")
    print(f"[EMAIL] CONFIRMACION -> {email}  |  Para: {name}")


def notify_admin(name: str, email: str, message: str) -> None:
    """
    Tarea en segundo plano: notifica al equipo interno sobre nuevo contacto.
    TODO: Reemplazar con email real al equipo de REDSAM.
    """
    logger.info(f"[EMAIL] Nueva solicitud de contacto de {name} <{email}>")
    print(f"[ADMIN] NUEVO CONTACTO  |  {name}  |  {email}  |  {message[:80]}...")


@router.post(
    "/",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Enviar formulario de contacto",
    description="Endpoint público. Guarda el mensaje y programa notificaciones por correo.",
)
async def submit_contact_form(
    contact_in: ContactCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """
    Recibe un formulario de contacto del frontend, lo persiste en la base de datos
    y delega el envío de correos a tareas en segundo plano para no bloquear la respuesta.
    """
    try:
        contact = await create_contact(db=db, contact_in=contact_in)
    except SQLAlchemyError as exc:
        logger.error(f"Error al guardar contacto: {exc}")
        raise BadRequestException(detail="No se pudo guardar el mensaje. Intenta nuevamente.")

    # Programar correos sin bloquear la respuesta al cliente
    background_tasks.add_task(send_confirmation_email, contact.email, contact.name)
    background_tasks.add_task(notify_admin, contact.name, contact.email, contact.message)

    return contact


# ─────────────────────────────────────────────────────────────────────────────
#  ENDPOINTS PROTEGIDOS — Requieren JWT válido
# ─────────────────────────────────────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[ContactResponse],
    summary="Listar todos los contactos",
    description="Requiere autenticación JWT. Retorna los mensajes de contacto más recientes.",
)
async def read_contacts(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contacts = await get_contacts(db=db, skip=skip, limit=limit)
    return contacts


@router.get(
    "/{contact_id}",
    response_model=ContactResponse,
    summary="Obtener un contacto por ID",
    description="Requiere autenticación JWT.",
)
async def read_contact(
    contact_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contact = await get_contact(db=db, contact_id=contact_id)
    if not contact:
        raise NotFoundException(detail=f"Contacto #{contact_id} no encontrado")
    return contact


@router.patch(
    "/{contact_id}/read",
    response_model=ContactResponse,
    summary="Marcar contacto como leído",
    description="Requiere autenticación JWT.",
)
async def mark_as_read(
    contact_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contact = await mark_contact_as_read(db=db, contact_id=contact_id)
    if not contact:
        raise NotFoundException(detail=f"Contacto #{contact_id} no encontrado")
    return contact


@router.delete(
    "/{contact_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar un contacto",
    description="Requiere autenticación JWT.",
)
async def remove_contact(
    contact_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = await delete_contact(db=db, contact_id=contact_id)
    if not deleted:
        raise NotFoundException(detail=f"Contacto #{contact_id} no encontrado")
