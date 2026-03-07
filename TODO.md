# TODO - CollaHub Communication Feature

## Phase 1: Backend
- [x] 1.1 Create new model `models/message.js` for community posts (with comments)
- [x] 1.2 Create new route `routes/community.js` with full CRUD + comments
- [x] 1.3 Update Socket.IO for real-time notifications
- [x] 1.4 Add `lastSeenCommunity` field to User model

## Phase 2: Server Setup
- [x] 2.1 Add community router to server.js

## Phase 3: Frontend - Community Page
- [x] 3.1 Create `Community.jsx` component with:
  - Post creation with text and attachments
  - Feed display with pagination
  - Like/unlike posts
  - Comments on posts (add, view, delete)
  - Edit and delete own posts
  - HOD can delete any post/comment
  - Notification badge with unread count
  - Notification drawer for viewing notifications
  - Real-time updates via Socket.IO

## Phase 4: Sidebar Updates
- [x] 4.1 Update StudentSideBar.jsx with Community menu item
- [x] 4.2 Update MentorSideBar.jsx with Community menu item
- [x] 4.3 Update HOD SideBar.jsx with Community menu item

## Phase 5: Routing
- [x] 5.1 Add routing in StudentHomePage.jsx
- [x] 5.2 Add routing in MentorHomepage.jsx
- [x] 5.3 Add routing in HODHomePage.jsx

## Features Implemented:
- **CollaHub** - A community communication feature where users (HOD, Supervisor, Student) can:
  - Create text posts
  - Attach and upload images, videos, and documents
  - Like posts
  - Comment on posts
  - Edit their own posts
  - Delete their own posts (HOD can also delete any post)
  - Real-time updates via Socket.IO
  - Role-based access control
  - **Notification System**:
    - Badge count on CollaHub title showing unread messages/comments
    - Real-time notifications for new comments on your posts
    - Notification drawer to view all notifications
    - Mark as seen functionality to clear the count
    - Notifications are cleared when user views the Community page

