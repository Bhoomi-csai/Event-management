📚 CampusConnect – College Event Management Platform

CampusConnect is a centralized digital platform that streamlines how college events are created, discovered, and managed.
It eliminates scattered information across WhatsApp groups, notice boards, and social media — ensuring students never miss important events.

🚀 1. Project Title

CampusConnect – A College Event Management Platform

🧩 2. Problem Statement

In most colleges, event information is scattered across multiple channels like WhatsApp groups, notice boards, and social media.
This causes:

Confusion

Low participation

Missed opportunities

CampusConnect solves this by creating a centralized platform for event posting, discovery, registration, and communication.
It simplifies workflows for both students and organizers, boosting participation and efficiency.

🏗️ 3. System Architecture
Architecture Flow
Frontend → Backend (API) → Database

Tech Stack Overview
Layer	Technologies
Frontend	React.js, React Router, Axios
Backend	Node.js, Express.js
Database	MySQL (Prisma ORM)
Authentication	JWT, bcrypt
Hosting	Vercel (Frontend), Render/Railway (Backend), PlanetScale/Aiven (MySQL)
🎯 4. Key Features
🔐 Authentication & Authorization

Secure signup/login using JWT

Password encryption using bcrypt

Role-based access (Student / Club Leader / Admin)

📅 Event Management (CRUD)

Club Leaders can create, update, delete events

Admin approval system (approve/reject)

📝 Event Registration System

Students can register/unregister for events

Organizers can view/manage participants

🔍 Search / Filter / Sort

Search by event name

Filter by category (Tech, Cultural, Sports)

Sort by event date

📄 Pagination

Faster loading

Cleaner UI for long event lists

📊 Dashboards

Student Dashboard: Registered events

Club Leader Dashboard: Created events

Admin Dashboard: Platform overview

🌐 Frontend Routing

Pages include:
Home, Events, Event Details, Login, Signup, Dashboard

🚀 Deployment

Frontend → Vercel / Netlify

Backend → Render / Railway

Database → PlanetScale / Aiven

🛠️ 5. Tech Stack
Category	Technologies
Frontend	HTML, CSS, JS, React.js, Axios, React Router
Backend	Node.js, Express.js
Database	MySQL (Prisma ORM)
Authentication	JWT, bcrypt.js
Hosting	Vercel, Render/Railway, PlanetScale
📡 6. API Overview
Authentication
Endpoint	Method	Description	Access
/api/auth/signup	POST	Register a new user	Public
/api/auth/login	POST	Login & receive JWT token	Public
Event / Property Management

(Your example endpoints mention "properties"—adjust as needed for events)

Endpoint	Method	Description	Access
/api/properties	GET	Get all listings	Authenticated
/api/properties	POST	Create a listing	Owner Only
/api/properties/:id	PUT	Update listing	Owner Only
/api/properties/:id	DELETE	Delete listing	Owner Only
Favorites
Endpoint	Method	Description	Access
/api/favorites	POST	Add to favorites	Tenant
/api/favorites/:id	DELETE	Remove from favorites	Tenant
