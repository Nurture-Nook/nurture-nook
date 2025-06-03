from enum import Enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from db import Base

post_categories = Table(
	'post_categories', Base.metadata,
	Column('post_id', ForeignKey('posts.id'), primary_key = True),
	Column('category_id', ForeignKey('categories.id'), primary_key = True)
)

post_warnings = Table(
	'post_warnings', Base.metadata,
	Column('post_id', ForeignKey('posts.id'), primary_key = True),
	Column('warning_id', ForeignKey('content_warnings.id'), primary_key = True)
)

comment_warnings = Table(
	'comment_warnings', Base.metadata,
	Column('comment_id', ForeignKey('comments.id'), primary_key = True),
	Column('warning_id', ForeignKey('content_warnings.id'), primary_key = True)
)

class SenderType(Enum):
	USER = 'user'
	BOT = 'bot'

class Approval(Enum):
	APPROVED = 'approved'
	PENDING = 'pending'
	REJECTED = 'rejected'

class User(Base):
	__tablename__ = 'users'

	id = Column(Integer, primary_key = True, index = True)
	username = Column(String, unique = True, nullable = False, index = True)
	email = Column(String, unique = True, nullable = False)
	hashed_pass = Column(String, nullable = False)
	hashed_token = Column(String, nullable = True)
	token_expiry = Column(DateTime, nullable = True)
	created_at = Column(DateTime(timezone = True), server_default = func.now())

	posts = relationship('Post', back_populates = 'user')
	comments = relationship('Comment', back_populates = 'user')
	temps = relationship('TemporaryUsername', back_populates = 'user')
	chats = relationship('Chat', back_populates = 'user')
	messages = relationship('Message', back_populates = 'user')

# Filters

class Category(Base):
	__tablename__ = 'categories'

	id = Column(Integer, primary_key = True, index = True)
	title = Column(String, unique = True, nullable = False, index = True)
	description = Column(String)
	stat = Column(Enum(Approval), default = Approval.PENDING)

	posts = relationship('Post', secondary = post_categories, back_populates = 'categories')

class ContentWarning(Base):
	__tablename__ = 'content_warnings'

	id = Column(Integer, primary_key = True, index = True)
	title = Column(String, unique = True, nullable = False, index = True)
	description = Column(String)
	stat = Column(Enum(Approval), default = Approval.PENDING)

	posts = relationship('Post', secondary = post_warnings, back_populates = 'warnings')
	comments = relationship('Comment', secondary = comment_warnings, back_populates = 'warnings')

# Garden of Support

class Post(Base):
	__tablename__ = 'posts'

	id = Column(Integer, primary_key = True, index = True)
	title = Column(String, nullable = False, index = True)
	description = Column(String, nullable = False)
	temporary_username = Column(String, nullable = False)
	flag_reason = Column(String, nullable = False)
	is_flagged = Column(Boolean, default = False)
	is_deleted = Column(Boolean, default = False)
	created_at = Column(DateTime(timezone = True), server_default = func.now())

	user_id = Column(Integer, ForeignKey('users.id'), nullable = False)

	user = relationship('User', back_populates = 'posts')
	temps = relationship('TemporaryUsername', back_populates = 'post')
	categories = relationship('Category', secondary = post_categories, back_populates = 'posts')
	warnings = relationship('ContentWarning', secondary = post_warnings, back_populates = 'posts')
	comments = relationship('Comment', back_populates = 'post')

class Comment(Base):
	__tablename__ = 'comments'

	id = Column(Integer, primary_key = True, index = True)
	content = Column(String, nullable = False)
	temporary_username = Column(String, nullable = False)
	flag_reason = Column(String, nullable = False)
	is_flagged = Column(Boolean, default = False)
	is_deleted = Column(Boolean, default = False)
	created_at = Column(DateTime(timezone = True), server_default = func.now())

	user_id = Column(Integer, ForeignKey('users.id'), nullable = False)
	post_id = Column(Integer, ForeignKey('posts.id'), nullable = False)
	parent_comment_id = Column(Integer, ForeignKey('comments.id'), nullable = True)

	user = relationship('User', back_populates = 'comments')
	post = relationship('Post', back_populates = 'comments')
	parent = relationship('Comment', back_populates = 'replies', remote_side = Comment.id)
	replies = relationship('Comment', back_populates = 'parent')
	warnings = relationship('Comment', secondary = comment_warnings, back_populates = 'comments')

class TemporaryUsername(Base):
	id = Column(Integer, primary_key = True, index = True)
	alias = Column(String, unique = True, nullable = False)

	user_id = Column(Integer, ForeignKey('users.id'), nullable = False)
	post_id = Column(Integer, ForeignKey('posts.id'), nullable = False)

	user = relationship('User', back_populates = 'temps')
	post = relationship('Post', back_populates = 'temps')

# Nurture Guide

class Chat:
	__tablename__ = 'chats'

	id = Column(Integer, primary_key = True, index = True)

	user_id = Column(Integer, ForeignKey('users.id'), nullable = False)
	started_at = Column(DateTime(timezone = True), server_default = func.now(), nullable = False)

	user = relationship('User', back_populates = 'chats')
	messages = relationship('Message', back_populates = 'chat')

class Message:
	__tablename__ = 'messages'

	id = Column(Integer, primary_key = True, index = True)
	sender_type = Column(Enum(SenderType), nullable = False)
	content = Column(String, nullable = False)
	created_at = Column(DateTime(timezone = True), server_default = func.now())

	chat_id = Column(Integer, ForeignKey('chats.id'), nullable = False)
	user_id = Column(Integer, ForeignKey('users.id'), nullable = True)
	
	user = relationship('User', back_populates = 'messages')
	chat = relationship('Chat', back_populates = 'messages')
