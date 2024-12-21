from app.extensions import db
import bcrypt
import pytz
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


Kyrgyzstan_tz = pytz.timezone('Asia/Bishkek')
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(Kyrgyzstan_tz))
    
    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))


class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(Kyrgyzstan_tz))

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))


class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(200), nullable=False)
    event_description = db.Column(db.String(2000), nullable=False)
    event_preview = db.Column(db.Text, nullable=True)
    event_date = db.Column(db.DateTime, nullable=False)
    event_start_time = db.Column(db.DateTime, nullable=False)
    event_end_time = db.Column(db.DateTime, nullable=True)
    event_price = db.Column(db.Integer, nullable=False)
    event_address = db.Column(db.String(200), nullable=False)
    event_admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(Kyrgyzstan_tz))
                

class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=lambda: datetime.now(Kyrgyzstan_tz))  # Дата бронирования
    status = db.Column(db.String(50), nullable=False, default="Pending")  # Статус бронирования (Pending, Confirmed, Cancelled)
    price = db.Column(db.Numeric(10, 2), nullable=False)

    # Связи
    user = db.relationship('User', backref=db.backref('tickets', lazy=True))
    event = db.relationship('Event', backref=db.backref('tickets', lazy=True))

    def confirm(self):
        """Подтвердить бронирование."""
        self.status = "Confirmed"

    def cancel(self):
        """Отменить бронирование."""
        self.status = "Cancelled"

    def __repr__(self):
        return f"<Ticket id={self.id} user_id={self.user_id} event_id={self.event_id} status={self.status}>"
