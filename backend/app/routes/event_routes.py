from flask import Blueprint, request, jsonify
from app.models import Event, Ticket
from app.extensions import db
from app.utils.auth import token_required
from app.services.event_service import create_event, allowed_file

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

event_bp = Blueprint('event', __name__)

@event_bp.route('/create-event', methods=['POST'])
@token_required
def create_event_route(current_admin):
    event_name = request.form.get('event_name')
    event_description = request.form.get('event_description')
    event_date = request.form.get('event_date')
    start_time = request.form.get('start_time')
    end_time = request.form.get('end_time')
    event_price = request.form.get('event_price')
    event_address = request.form.get('event_address')
    file = request.files.get('file')

    if not all([event_name, event_description, event_date, start_time, event_price, event_address]):
        return jsonify({"error": "Не все обязательные поля заполнены"}), 400
    
    if file and not allowed_file(file.filename):
        return jsonify({"error": "Неверный тип файла"}), 400
    
    data = {
        "event_name": event_name,
        "event_description": event_description,
        "event_date": event_date,
        "event_start_time": start_time,
        "event_end_time": end_time if end_time else None,
        "event_price": event_price,
        "event_address": event_address,
        "event_admin_id": current_admin.id
    }

    event = create_event(data, file) if file else create_event(data, None)
    if not event:
        return jsonify({"error": "Ошибка при создании события"}), 500

    return jsonify({"message": "Событие создано", "event_id": event.id}), 201
@event_bp.route('/events', methods=['GET'])
@token_required
def get_events_route(current_user):
    user_id = current_user.id
    search_query = request.args.get('search', '').strip()

    purchased_event_ids = db.session.query(Ticket.event_id).filter_by(user_id=user_id).all()
    purchased_event_ids = {event_id[0] for event_id in purchased_event_ids}  # Преобразуем в set для быстрого поиска

    query = Event.query.filter(
        ~Event.id.in_(purchased_event_ids)
    )

    if search_query:
        query = query.filter(
            (Event.event_name.ilike(f'%{search_query}%')) |
            (Event.event_description.ilike(f'%{search_query}%')) |
            (Event.event_address.ilike(f'%{search_query}%'))
        )

    events = query.order_by(Event.created_at.desc()).all()

    events_data_list = []
    for event in events:
        event_data = {
            'event_id': event.id,
            'event_name': event.event_name,
            'event_description': event.event_description,
            'event_date': event.event_date.strftime("%Y-%m-%d"),
            'event_start_time': event.event_start_time.strftime("%H:%M"),
            'event_end_time': event.event_end_time.strftime("%H:%M") if event.event_end_time else None,
            'event_price': event.event_price,
            'event_address': event.event_address,
            'event_preview': f'{event.event_preview}' if event.event_preview else None
        }
        events_data_list.append(event_data)
    return jsonify({"events": events_data_list}), 200


@event_bp.route('/admin-events', methods=['GET'])
@token_required
def get_admins_events(current_admin):
    admin_id = current_admin.id
    
    events = Event.query.filter_by(event_admin_id=admin_id).order_by(Event.created_at.desc()).all()

    events_data_list = []
    for event in events:
        event_data = {
            "event_id": event.id,
            'event_name': event.event_name,
            'event_description': event.event_description,
            'event_date': event.event_date.strftime("%Y-%m-%d"),
            'event_start_time': event.event_start_time.strftime("%H:%M"),
            'event_end_time': event.event_end_time.strftime("%H:%M") if event.event_end_time else None,
            'event_price': event.event_price,
            'event_address': event.event_address,
            'event_preview': f'{event.event_preview}' if event.event_preview else None
        }
        events_data_list.append(event_data)

    return jsonify({"events": events_data_list}), 200
