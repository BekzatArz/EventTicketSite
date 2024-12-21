from flask import Blueprint, request, jsonify
from app.models import Ticket, Event
from app.services.ticket_service import create_ticket
from app.utils.auth import token_required
from datetime import datetime
from app.extensions import db

ticket_bp = Blueprint('ticket', __name__)

@ticket_bp.route('/create-ticket', methods=['POST'])
@token_required
def create_ticket_route(current_user):
    user_id = current_user.id

    data = request.get_json()
    if not data.get('event_id') or not data.get('price'):
        return jsonify({"error": "Missing data"}), 400
    ticket = create_ticket(data, user_id)
    if not ticket:
        return jsonify({"error": "Ошибка при создании события"}), 500
    
    return jsonify({"message": "Запрос на билет отправлен", "ticket_id": ticket.id}), 201
    

@ticket_bp.route('/my-tickets', methods=["GET"])
@token_required
def get_my_tickets(current_user):
    user_id = current_user.id

    tickets = Ticket.query.filter_by(user_id=user_id).all()
    if not tickets:
        return jsonify({"message": []}), 200

    events_data_list = []
    for ticket in tickets:
        event = Event.query.get(ticket.event_id)
        if event:
            event_data = {
                'ticket_id': ticket.id,
                'event_id': event.id,
                'event_name': event.event_name,
                'event_description': event.event_description,
                'event_date': event.event_date.strftime("%Y-%m-%d"),
                'event_start_time': event.event_start_time.strftime("%H:%M"),
                'event_end_time': event.event_end_time.strftime("%H:%M") if event.event_end_time else None,
                'event_price': event.event_price,
                'event_address': event.event_address,
                'event_preview': f'{event.event_preview}' if event.event_preview else None,
                'ticket_status': ticket.status,
                'booking_date': ticket.booking_date.strftime("%Y-%m-%d %H:%M:%S")
            }
            events_data_list.append(event_data)
    response = jsonify({"tickets": events_data_list})

    return response, 200

@ticket_bp.route('/event-users/<int:event_id>', methods=["GET"])
@token_required
def get_event_users(current_user, event_id):
    tickets = Ticket.query.filter_by(event_id=event_id).all()
    
    if not tickets:
        return jsonify({"message": []}), 200
    
    users_data_list = []
    for ticket in tickets:
        user = ticket.user  
        if user:
            user_data = {
                'user_id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'phone_number': user.phone_number,
                'ticket_id': ticket.id,
                'ticket_status': ticket.status,
                'booking_date': ticket.booking_date.strftime("%Y-%m-%d %H:%M:%S")
            }
            users_data_list.append(user_data)
    
    return jsonify({"users": users_data_list}), 200

@ticket_bp.route('/change-status', methods=['POST'])
@token_required
def change_ticket_status(current_user):
    data = request.get_json()
    ticket_id = data.get('ticket_id')
    new_status = data.get('status')
    
    if not ticket_id or not new_status:
        return jsonify({"error": "Missing ticket ID or status"}), 400
    
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
    
    valid_statuses = ['pending', 'confirmed', 'canceled']
    if new_status not in valid_statuses:
        return jsonify({"error": "Invalid status"}), 400

    ticket.status = new_status
    db.session.commit()
    
    return jsonify({"message": "Ticket status updated successfully", "ticket_id": ticket.id, "new_status": new_status}), 200

@ticket_bp.route('/ticket-status/<int:ticket_id>', methods=["GET"])
@token_required
def get_ticket_status(current_user, ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404

    return jsonify({"ticket_id": ticket.id, "status": ticket.status}), 200
