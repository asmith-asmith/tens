# CLAUDE.md — tens

This file documents the codebase for AI assistants working in this repository.

## Project Overview

**tens** is a full-stack lists/to-do application built with the MERN stack. Users can create categorized lists with individual items. The project has a React (class-component) frontend served by Create React App, and an Express.js backend that also serves the production build.

---

## Tech Stack

- **Frontend**: React 16 (class-based components), Create React App, plain CSS
- **Backend**: Express.js 4, Node.js
- **Database**: MongoDB via Mongoose 5
- **HTTP logging**: Morgan
- **Package manager**: npm
- **Testing**: React Testing Library + Jest (via `react-scripts test`)

---

## Repository Structure

```
.
├── config/
│   └── database.js          # Mongoose connection setup (localhost:27017/lists)
├── controllers/
│   └── api/
│       └── lists.js         # Controller functions for list CRUD (stub — currently empty)
├── models/
│   ├── lists.js             # Mongoose List + Item schemas
│   └── users.js             # Mongoose User schema
├── routes/
│   └── api/
│       └── lists.js         # Express router for /api/lists (stub — currently empty)
├── public/                  # Static files served by Express in production
├── src/                     # React frontend (Create React App)
│   ├── pages/
│   │   └── App/
│   │       ├── App.js       # Root React component
│   │       ├── App.css
│   │       └── App.test.js
│   ├── components/
│   │   ├── ListCard/
│   │   │   └── ListCard.jsx # Card display for a single list
│   │   └── ListList/
│   │       └── ListList.jsx # Component that renders a collection of lists
│   ├── index.js             # React entry point
│   ├── index.css
│   └── serviceWorker.js
├── server.js                # Express app entry point
└── package.json
```

---

## How the App Runs

### Development
Two servers run concurrently:
- **React dev server**: `npm start` → `http://localhost:3000`
- **Express backend**: run separately → `http://localhost:3001`

The frontend proxies API requests to the backend via the `"proxy"` field in `package.json`:
```json
"proxy": "http://localhost:3001"
```
So a `fetch("/api/lists")` in React will reach Express on port 3001.

To start the backend:
```bash
node server.js
```

### Production
Build the React app first (`npm run build`), then `node server.js` serves the static build from the `build/` directory and handles API routes on port 3001 (or `process.env.PORT`).

---

## Development Commands

```bash
# Install dependencies
npm install

# Start React dev server (http://localhost:3000)
npm start

# Run tests
npm test

# Build production bundle
npm run build

# Start Express server (port 3001)
node server.js
```

---

## Architecture

### Backend: Express MVC

The backend follows an MVC-like pattern:

| Layer | Location | Purpose |
|---|---|---|
| Routes | `routes/api/lists.js` | Define URL endpoints, delegate to controllers |
| Controllers | `controllers/api/lists.js` | Business logic and response handling |
| Models | `models/lists.js`, `models/users.js` | Mongoose schemas and DB interaction |
| Config | `config/database.js` | MongoDB connection |

`server.js` is the entry point and wires everything together. The comments in `server.js` mark where to plug in the database require, router require, and route mounting:
```js
/*--- Spot for database ---*/       // require('./config/database')
/*--- Spot for recordRouter ---*/   // const listsRouter = require('./routes/api/lists')
/*--- Spot for api routes ---*/     // app.use('/api/lists', listsRouter)
/*--- Spot for catch all route ---*/// app.get('/*', (req, res) => res.sendFile(...))
```

### Data Models

**List** (`models/lists.js`)
- `title` (String, required)
- `category` (String, required, default: `"General"`)
- `items` (array of embedded Item subdocuments)
- `user` (ObjectId ref → `User`, required)
- Timestamps enabled

**Item** (embedded in List)
- `content` (String)
- `user` (ObjectId ref → `User`, required)
- Timestamps enabled

> **Known bug**: `models/lists.js` currently exports `recordSchema` which is not defined — it should export `listSchema`. Fix: change the last line to `module.exports = mongoose.model('List', listSchema);`

**User** (`models/users.js`)
- Basic user schema (details TBD)

### Frontend: React (Class Components)

The React app uses **class-based components** (React 16 era). All state management and lifecycle methods follow the class component pattern:

```jsx
class MyComponent extends Component {
  /*--- State ---*/
  /*--- Handle Methods ---*/
  /*--- Lifecycle Methods ---*/
  render() { ... }
}
```

Key components:
- `src/pages/App/App.js` — Root component, renders `<ListCard>` and `<ListList>`
- `src/components/ListCard/ListCard.jsx` — Displays a single list as a card
- `src/components/ListList/ListList.jsx` — Renders a collection of lists

---

## Key Conventions

- **Class components**: This project uses class components, not function components with hooks. Follow the existing pattern when adding new components.
- **File structure**: Each component lives in its own directory (`ComponentName/ComponentName.jsx`) with a co-located CSS file if needed.
- **API routes**: All backend API routes are prefixed with `/api/` and organized under `routes/api/`
- **Controllers**: Route handlers live in `controllers/api/` — keep business logic out of route files
- **No TypeScript**: This is plain JavaScript. Do not add TypeScript without discussing with the team.

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Express server port (defaults to `3001`) |
| `MONGODB_URI` | MongoDB connection string (currently hardcoded in `config/database.js` as `mongodb://localhost:27017/lists`) |

To use a remote MongoDB instance, update `config/database.js` to read from `process.env.MONGODB_URI`.

---

## Known Issues / Work In Progress

1. **`models/lists.js` export bug**: exports `recordSchema` (undefined) instead of `listSchema`. Last line should be:
   ```js
   module.exports = mongoose.model('List', listSchema);
   ```
2. **`controllers/api/lists.js` is empty** — controller functions need to be implemented
3. **`routes/api/lists.js` is empty** — routes need to be wired to controller functions
4. **`server.js` stubs** — database, router, and route mounting are commented out and need to be connected
5. **No auth middleware** — user authentication is not yet implemented despite `User` references in models

---

## Adding New Features

1. **New API endpoint**: Add route to `routes/api/lists.js`, add handler to `controllers/api/lists.js`
2. **New model**: Create `models/<name>.js` following the Mongoose schema pattern
3. **New React page**: Add directory under `src/pages/` with a class component
4. **New React component**: Add directory under `src/components/` following the `ComponentName/ComponentName.jsx` pattern
5. **Wire up the backend**: Add the required `require` statements and `app.use()` calls in `server.js` where the stub comments indicate
