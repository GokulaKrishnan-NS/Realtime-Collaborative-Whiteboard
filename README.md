# Realtime-Multiplayer-Whiteboard

PROJECT OVERVIEW

Realtime Multiplayer Whiteboard
A collaborative digital canvas where multiple users can draw, write, erase, and interact in real time using WebSockets (Socket.io).
Purpose
The goal of this project is to create a simple yet powerful online whiteboard where multiple users can draw together in real time.

This repository provides a **starter boilerplate** with:
- Next.js project scaffold  
- App Router structure (`/app` folder)
- A basic `/board` page
- Reusable React components (`Canvas`, `Toolbar`)
- Initial Socket.io backend route
- Clean folder structure ready for contributors
  
This project aims to create an easy, fast, and modern online whiteboard that can be used for:
- Brainstorming sessions  
- Online study discussions  
- Classroom explanations  
- Quick sketch sharing  
- Collaborative design  

The goal is to build a scalable platform where contributors can add tools, improve UI, and enhance real-time syncing.

---
## Tech Stack

### **Frontend**
- Next.js (React-based framework)
- React.js
- Tailwind CSS (optional)
- Socket.io-client

### **Backend**
- Next.js API route using Socket.io server

## Features (Final Vision)
- Real-time drawing synchronized across all connected users  
- Multiple brush sizes & colors  
- Eraser tool  
- Live cursors (see where others are drawing)  
- Clear board for all users  
- Save board as image  
- Chat sidebar (optional future feature)  
- Authentication (future extension)

---

## Tech Stack
- **Next.js** – Pages, routing, backend API routes  
- **React.js** – UI components  
- **Socket.io** – Real-time sync  
- **Canvas API** – Drawing  
- **TailwindCSS** (optional but recommended)

---

my-whiteboard/

│

├── app/

│   ├── page.js 

│   ├── layout.js 

│   ├── globals.css

│   │

│   ├── board/

│   │   └── page.js  

│   │

│   └── api/

│       └── socket/

│           └── route.js 

│

├── components/

│   ├── Canvas.js 

│   └── Toolbar.js 

│

├── public/

│   └── favicon.ico

│

├── package.json

└── next.config.js



---

## How It Works
- The **Canvas component** captures user drawing events  
- Events are broadcast via **Socket.io**  
- Other clients receive the events and update their canvas

---

## How to Contribute

1. Pick an issue.
2. Create a branch:
   ```
   git checkout -b feature/issue-name
   ```
3. Implement your feature  
4. Open a Pull Request  
5. Tag maintainers for review  

---

## Contributors can work on:

Canvas

Freehand drawing

Erasing

Color picker

Brush sizes

Clear screen

Sockets (Real-time)

Sync drawing strokes

User cursors

Undo/redo sync

UI/UX

Better toolbar

Responsive design

Multi-board rooms

Infra

Deployment (Vercel)

Rate limiting

Optimizing socket performance
