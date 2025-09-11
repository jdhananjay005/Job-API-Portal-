

# Job-API-Portal-

A RESTful Job Portal API built with Node.js, Express and MongoDB. Provides user authentication (JWT), user profile management, job CRUD with filtering, sorting and pagination, and job statistics.

## Features

- User registration and login (JWT)
- Profile update
- Create / Read / Update / Delete jobs
- Search, filter, sort and paginate jobs
- Job statistics (aggregation by status)
- Swagger API documentation

## Tech stack

- Node.js (ES Modules)
- Express
- MongoDB + Mongoose
- dotenv
- jsonwebtoken (JWT)
- bcryptjs (password hashing)
- helmet, cors, morgan
- swagger-jsdoc + swagger-ui-express

## Prerequisites

- Node.js v18+ (recommended)
- npm
- Running MongoDB instance (local or cloud)

## Setup (Windows PowerShell)

1. Open project folder:

2. Install dependencies:
   npm install

3. Create a `.env` file in project root with at least:

   - MONGO_URI=<your-mongo-connection-string>
   - JWT_SECRET=<strong-secret>
   - PORT=8000 (optional)
   - DEV_MODE=development (optional)

4. Start development server:
   npm run server

   or production:
   npm start

## Available scripts (package.json)

- npm run server — start with nodemon (dev)
- npm start — start app (prod)

## API Documentation (Swagger)

Swagger UI is served at:

- http://localhost:8000/api-doc (or use your PORT)

Swagger/OpenAPI definitions are generated from JSDoc blocks. Files:

- docs/swaggerDef.js (schemas, components)
- docs/swaggerPaths.js (paths/examples)
- server mounts swagger-ui-express in `server.js`.

If you add/update JSDoc blocks, restart the server to refresh docs.

## Environment variables

- MONGO_URI — MongoDB connection string (required)
- JWT_SECRET — secret key for signing JWTs (required)
- PORT — port the server listens on (default 8000)
- DEV_MODE — optional label for logs (e.g., "development")

## Project structure (important files)

- server.js — app bootstrap, middleware, routes, swagger
- config/db.js — MongoDB connection
- routes/ — route definitions (authRoutes, userRoutes, jobsRoutes, testRoutes)
- controllers/ — controllers for auth, user, jobs, test
- models/ — Mongoose models (User, Job)
- middlewares/ — auth & error middlewares
- docs/ — Swagger definition and path JSDoc (if present)
- jobs-data.json — sample data (optional)

## Notes & Recommendations

- Do not return password fields in API responses. Controllers should omit password before sending user objects.
- Ensure JWT_SECRET is strong and not committed to source control.
- Limit console.log usage in production; switch to a logger (winston/pino) if needed.
- Consider adding input validation (Joi or express-validator) and stricter CORS config for production.

## Troubleshooting

- Mongoose connection errors: verify MONGO_URI and network access.
- Authentication errors: check JWT_SECRET matches the one used when issuing tokens.
- "Port in use": change PORT in `.env` or stop the process using the port.

## Contributing

1. Fork repository
2. Create feature branch
3. Run tests / linting (if present)
4. Open PR with description of changes
