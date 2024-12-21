from app.models import Ticket
from app.extensions import db

def create_ticket(data, user_id):
    ticket = Ticket(
        user_id=user_id,
        event_id=data['event_id'],
        price=data['price'],
        status='pending'
    )
    db.session.add(ticket)
    db.session.commit()
    return ticket
