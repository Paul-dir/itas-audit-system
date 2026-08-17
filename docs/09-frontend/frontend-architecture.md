# Frontend Architecture

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the high-level architecture for the ITAS Tax Audit System frontend. 

---

## 1. Core Technologies
- **Framework:** React 18+ (Single Page Application)
- **Routing:** React Router v6
- **State Management:** Redux Toolkit (RTK) & RTK Query for API caching
- **Styling:** Tailwind CSS + Headless UI components (or equivalent design system)
- **Authentication:** Keycloak JS adapter (OIDC)

---

## 2. The Global Application Shell

The ITAS frontend is designed as a **single, cohesive interface**. We do NOT build separate applications for different user types. 

The application uses a **Global Layout Shell** consisting of:
1. **Top Navbar:** Contains Page Title, Current Date, Theme Toggle (Light/Dark), Notifications, and User Profile Avatar.
2. **Left Sidebar (Dynamic):** Displays the user's role profile and the navigation menu.
3. **Main Workspace:** The central area where the active route/component is rendered.
4. **Right Panel (Optional):** Contextual summary data (e.g., workload, skills breakdown) depending on the active view.

---

## 3. Dynamic RBAC Navigation (Role-Based Access Control)

As strictly required, the Sidebar Menu and the accessible Workspaces **must dynamically change based on the user's role**. 

### How it works:
1. Upon login, the React app receives the JWT from Keycloak.
2. The JWT contains the user's roles (e.g., `ROLE_AUDITOR`, `ROLE_NATIONAL_DIRECTOR`, `ROLE_PROCESS_OWNER`).
3. The `Sidebar` component maps these roles to a predefined list of allowed navigation routes.
4. If a user is a **Planning Auditor**, they only see "Dashboard", "Audit Plans", and "Risk Analysis" in the sidebar. 
5. If the user is a **Tax Auditor**, the sidebar dynamically changes to show "My Audit Cases", "Draft Reports", and "Working Papers".

**Code Concept:**
```javascript
// Sidebar rendering logic
const allowedMenus = ALL_MENUS.filter(menu => 
    userRoles.some(role => menu.allowedRoles.includes(role))
);
```

---

## 4. Feature Folder Structure

To support our 4-developer parallel tracks, the frontend codebase mirrors the backend Hexagonal architecture by using **Feature Slices**:

```text
src/
 ├── app/                  # Global store, auth, and layout shell
 ├── common/               # Shared UI components (Buttons, Modals, Tables)
 ├── features/
 │    ├── ap/              # Pawlos: Annual Plan, Case Selection
 │    ├── ex/              # Oliad: Desk & Comp Audit Workspaces
 │    ├── tp/              # Borifa: Transfer Pricing Forms
 │    ├── ja/              # Yoseph: Joint Audit Workspaces
 │    ├── rf/              # Yoseph: Reporting & Finalization
 │    └── ia/              # Borifa: Issue Audit Trackers
 └── routes/               # Central route definitions
```

Each developer works entirely within their `features/<cluster>` folder to prevent merge conflicts on the frontend.
