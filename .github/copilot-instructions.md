# GitHub Copilot Instructions

## General Guidelines
- Generate clean, readable, production-ready code
- Follow SOLID principles
- Avoid hard-coded values
- Prefer configuration-driven logic

## Code Style
- Use meaningful variable and function names
- Follow language-specific best practices
- Add comments only where business logic exists

## Error Handling
- Handle all edge cases
- Never suppress exceptions silently
- Return meaningful error messages

## Testing
- Always generate unit-testable code
- Prefer pure functions where possible

## Testing Instructions

- Generate unit tests alongside production code
- Prefer deterministic, data-driven tests
- Avoid hard-coded assertions
- Use descriptive test names

## Test Coverage
- Cover happy paths and edge cases
- Validate business rules, not static values

## Backend Instructions

### API Design
- Use RESTful conventions
- Validate all request inputs
- Return proper HTTP status codes

### Security
- Do not expose sensitive data
- Sanitize user inputs
- Follow OWASP best practices

### Logging
- Log errors and critical business events
- Do not log PII or secrets

### Performance
- Avoid unnecessary database calls
- Prefer pagination for list APIs

## Frontend Instructions

### UI Components
- Create reusable components
- Use props for configuration
- Avoid inline styles

### State Management
- Handle loading, success, and error states
- Avoid unnecessary re-renders

### Accessibility
- Follow basic accessibility guidelines (ARIA, labels)
- Ensure keyboard navigation support

### UX
- Display user-friendly error messages
- Disable actions during async operations

## Enterprise Constraints
- Follow internal coding standards
- Ensure compliance with data protection regulations
- Do not generate mock credentials or secrets
- Prefer dependency injection

# Copilot Instructions for this repository

## Project overview
This repository contains a simple browser-based number guessing game built with plain HTML, CSS, and JavaScript.

## Working style
- Keep the app lightweight and dependency-free.
- Prefer small, readable JavaScript functions.
- Maintain the browser-only behavior: no backend or build tooling required.
- Preserve the game flow: difficulty selection, score tracking, and leaderboard persistence.

## UI expectations
- Keep the design modern, polished, and responsive.
- Ensure the app works well on both desktop and mobile width screens.
- Maintain accessibility labels and clear button/input states.

## Game rules
- Difficulty levels: Easy (1-50), Medium (1-100), Hard (1-500).
- Start each round with 100 points.
- Deduct 5 points for every incorrect guess.
- Do not allow guesses outside the current difficulty range.
- Save the top 5 scores to browser localStorage.
- Sort the leaderboard in descending score order.

## Implementation notes
- Use DOM APIs only; do not introduce frameworks or packages.
- Keep logic in src/index.js and styling in src/style.css.
- Prefer direct, maintainable updates to the DOM rather than complex abstractions.
- When changing game state, update both the visible UI and the stored leaderboard/state as needed.
