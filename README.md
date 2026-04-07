# GymX v2 — Premium Fitness Management Platform

A professional-grade gym management web application built with a modern, high-performance stack. Designed for elite fitness centers requiring robust authentication, real-time class booking, and a premium administrative experience.

## Tech Stack

- **Frontend**: [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables Design System
- **Backend/Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Row Level Security)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Internationalization**: Custom i18n system (English / French)
- **Icons**: [Lucide React](https://lucide.dev/)

## Key Features (Phase 1 MVP)

- **Secure Authentication**: Email/Password flow, account recovery, and automated profile creation via Supabase.
- **RBAC (Role-Based Access Control)**: Distinct portals for **Members** and **Administrators**.
- **Real-time Schedule**: Interactive class schedule with live capacity tracking, recurring sessions, and duplicate booking prevention.
- **Member Dashboard**: Manage personal bookings, update profile settings, and view fitness activity using centralized React Hooks.
- **Admin Command Center**: Complete CRUD for members, classes, trainers, and gym locations with standard DataTables.
- **Business Analytics**: Interactive visual charts (via Recharts) tracking bookings and most popular classes.
- **Premium Design System**: Dark-themed aesthetic with red accents, glassmorphism, responsive layouts, and custom modular alerts.
- **Localized Experience**: Fully dynamic and synchronized support for English and French across the entire platform.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- A Supabase project

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Zangafigue/gymx-v2.git
    cd gymx-v2
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    ```bash
    cp .env.example .env
    ```
    *Fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.*

4.  **Launch the development server**:
    ```bash
    npm run dev
    ```

## Roadmap

- [x] **Phase 1**: Foundations & Supabase setup.
- [x] **Phase 2**: Core Functionalities (Custom Hooks, Analytics, i18n sync, Database normalization, Password Rest).
- [ ] **Phase 3**: Supabase Edge Functions for secure automated emails (Resend integration).
- [ ] **Phase 4**: Payment gateway integration (Wave, Orange Money) & Membership subscriptions.
- [ ] **Phase 5**: In-app notification system (Push & In-box).
- [ ] **Phase 6**: PWA support for mobile installers.

## Status

> [!IMPORTANT]
> **Current Status**: Phase 2 (Core Functionalities & Architecture) is **Complete**. 
> The platform now features robust custom hooks, administrative charting, deep localization, and a fully normalized database schema ready for scale.

## License

This project is for demonstration purposes. All rights reserved.
