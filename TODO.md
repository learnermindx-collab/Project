# TODO - Supervisor Assigned Projects + 403 Fix

## Redis cache invalidation (completed)
- [x] Add `redis.del('projects:supervisor:<supervisorId>')` and `redis.del('projects:all')` after:
  - [x] `assignSupervisor`
  - [x] `approveProject`
  - [x] `rejectProject`
  - [x] `evaluateProject`

## 403 Forbidden after approve/reject (still pending)
- [ ] Inspect frontend token handling after supervisor/HOD actions.
- [ ] Ensure approve/reject requests use supervisor/HOD JWT (not student JWT) and that localStorage isn’t overwritten.
- [ ] Patch the relevant frontend component(s) (likely `myapp/src/Pages/Mentors/MentorProjects.jsx` and/or logout/401 logic in `myapp/src/api.js`).

