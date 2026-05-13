# Dashboard QA Accounts

Status: current as of 2026-05-13.

These non-production Supabase auth users cover the durable dashboard access-state
matrix. Passwords are intentionally not stored in the repository.

## Accounts

| State | Email | Expected dashboard branch |
| --- | --- | --- |
| Teacher | `qa-dashboard-teacher@example.com` | Teacher dashboard |
| Trial, no tier chosen | `qa-dashboard-trial-new@example.com` | Trial tier choice |
| Trial Foundation | `qa-dashboard-trial-foundation@example.com` | Student dashboard, trial Foundation |
| Trial Higher | `qa-dashboard-trial-higher@example.com` | Student dashboard, trial Higher |
| Full Foundation | `qa-dashboard-full-foundation@example.com` | Student dashboard, full Foundation |
| Full Higher | `qa-dashboard-full-higher@example.com` | Student dashboard, full Higher |
| Volna student | `qa-dashboard-volna@example.com` | Student dashboard, Volna |
| Expired student | `qa-dashboard-expired@example.com` | Expired access panel |

## Related Data

- Teaching group: `QA Dashboard Visual Checks`
- Teacher membership: `qa-dashboard-teacher@example.com`
- Student membership: `qa-dashboard-volna@example.com`
- Admin checks use the existing owner/admin account.
- Guest checks use a signed-out browser session.

## Notes

- The expired student intentionally keeps a previously active Higher grant with
  an end date in the past, so it resolves to the expired dashboard state rather
  than the no-tier trial state.
- The Volna student has both a Volna grant and a student teaching-group
  membership so school dashboard and assignment navigation can be checked.
- Use these accounts only for development and QA. Rotate their shared
  non-production password if the accounts are exposed outside the project team.
