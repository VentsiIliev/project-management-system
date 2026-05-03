# US-042 - View Project Activity

## Metadata

- Area: 11. Activity Logs
- GitHub labels: `user-story`, `mvp`, `area:activity`
- Suggested status: `Blocked`
- Suggested wave: `Wave 2`
- Depends on: `US-009`, `US-040`
- Parallelization note: Do not start this story before `US-040` exists. The project activity view is a read surface over project activity data, not the story that invents project activity logging.

## User Story

**As an** Admin or project member  
**I want** to view project activity  
**So that** I can audit important project-level changes.

## Acceptance Criteria

**Given** I have access to the project  
**When** I open project activity  
**Then** I can view relevant project activity entries for that project.

**Given** I do not have access to the project  
**When** I attempt to open project activity  
**Then** the system hides the project activity surface.

## Blocker

- `US-040` is not implemented yet, so there is no owned activity-log write model to read from.
- This story must remain blocked until the activity-recording contract exists.

## Current Slice Notes

- The previous local breakdown was copied from project CRUD and did not describe the real activity-read work.
- When unblocked, this story should build on the existing project detail route and visible-project permissions rather than creating a second project-access model.

## Intended Execution Breakdown Once Unblocked

### Backend Slice

- [ ] Reuse the activity-log model and write contract created by `US-040`.
- [ ] Add a project-scoped activity read query in the owning activity-log module.
- [ ] Implement a project activity endpoint that returns entries only for visible active projects.
- [ ] Hide inaccessible projects using the same exposure rule already used by project detail reads.

### Frontend Slice

- [ ] Extend the existing project workspace with a visible project-activity panel or route section.
- [ ] Load project activity from the backend for the selected project.
- [ ] Show loading, empty, and unavailable states.
- [ ] Do not replace the existing project detail workspace.

### Test Slice

- [ ] Add backend integration coverage for visible project activity reads by Admin and active members.
- [ ] Add backend integration coverage showing non-members and removed members cannot read project activity.
- [ ] Add frontend coverage for loading and rendering project activity in the existing project workspace.

## Definition Of Done Once Unblocked

- Project activity can be viewed for accessible projects.
- Inaccessible projects do not expose project activity.
- The project workspace shows loading, empty, and populated activity states.
- The story reads from the `US-040` activity-log contract rather than inventing a second logging source.
