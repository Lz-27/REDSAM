from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.db.models import Contact
from src.schemas.contact import ContactCreate
from typing import List, Optional


async def create_contact(db: AsyncSession, contact_in: ContactCreate) -> Contact:
    """Persiste un nuevo contacto. El commit lo gestiona el middleware de sesión (get_db)."""
    db_obj = Contact(
        name=contact_in.name,
        email=contact_in.email,
        phone=contact_in.phone,
        interest=contact_in.interest,
        message=contact_in.message,
        activity=contact_in.activity,
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj


async def get_contacts(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Contact]:
    result = await db.execute(
        select(Contact).offset(skip).limit(limit).order_by(Contact.created_at.desc())
    )
    return list(result.scalars().all())


async def get_contact(db: AsyncSession, contact_id: int) -> Optional[Contact]:
    result = await db.execute(select(Contact).filter(Contact.id == contact_id))
    return result.scalar_one_or_none()


async def mark_contact_as_read(db: AsyncSession, contact_id: int) -> Optional[Contact]:
    contact = await get_contact(db, contact_id)
    if not contact:
        return None
    contact.is_read = True
    await db.commit()
    await db.refresh(contact)
    return contact


async def delete_contact(db: AsyncSession, contact_id: int) -> bool:
    """Elimina un contacto. Devuelve True si existía, False si no."""
    contact = await get_contact(db, contact_id)
    if not contact:
        return False
    await db.delete(contact)
    await db.commit()
    return True
