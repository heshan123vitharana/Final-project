# Project Structure Overview

This file documents the recommended folder and file structure for the project. Follow this structure for all new features and components to ensure easy collaboration and future scalability.

## src/components/
- **dashboard/**: All dashboard-related components (main dashboard, widgets, registration, etc.)
  - **widgets/**: Dashboard widgets (e.g., LivePaddyPrices, CollectionCenters)
  - **registration/**: Mill registration multi-step form components
- **user/**: User-specific components (profile, orders, etc.)
- **admin/**: Admin-specific components (admin dashboard, management tools)

## src/hooks/
- Custom React hooks (e.g., useMillRegistration.js, useUserDashboard.js)

## src/utils/
- Utility functions (e.g., API helpers, formatting)

## src/data/
- Static data files (e.g., sample JSON, config)

## src/assets/
- Images, icons, and other static assets

---

**Best Practices:**
- Use one file per component.
- Name files and folders clearly and consistently.
- Add README or comments for complex folders/components.
- Keep shared logic in hooks and utils.
- Avoid editing files in other folders unless necessary.

This structure will help minimize merge conflicts and make future development easier.
