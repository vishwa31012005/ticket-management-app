# Customer Support Ticket Management System

## Overview
A full-stack application for managing customer support tickets, built with React (frontend) and Django (backend). Features include user authentication (customer/agent roles), ticket creation, status updates, and email notifications.

## Technologies
- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Django, Django REST Framework, PostgreSQL
- **Other**: Git, JWT Authentication

## Setup
1. Clone the repository: `git clone <your-repo-url>`
2. Navigate to `backend` and set up:
   - `python -m venv venv`
   - `venv\Scripts\activate`
   - `pip install -r requirements.txt` (create this file with dependencies)
   - Configure `.env` with database and email credentials
   - `python manage.py migrate`
   - `python manage.py runserver`
3. Navigate to `frontend/ticket-management-app` and set up:
   - `npm install`
   - `npm run dev`

## Features
- User authentication with role-based access
- Ticket creation and management
- Automated email notifications for status updates

## Future Improvements
- Add ticket assignment to agents
- Implement real-time updates with WebSockets
- Enhance UI with Figma designs