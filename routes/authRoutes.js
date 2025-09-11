import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerController,
  loginController,
} from "../controllers/authController.js";

// IP Limiter

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//Router Object
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         err:
 *           nullable: true
 *           description: optional error details
 *
 *     AuthRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "John"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "secret123"
 *
 *     AuthLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           example: "secret123"
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1f2c9b1e4f123456789ab"
 *         name:
 *           type: string
 *           example: "John"
 *         lastname:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         location:
 *           type: string
 *           example: "India"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User created"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     UpdateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - lastname
 *         - email
 *         - location
 *       properties:
 *         name:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         location:
 *           type: string
 *
 *     JobInput:
 *       type: object
 *       required:
 *         - company
 *         - position
 *       properties:
 *         company:
 *           type: string
 *           example: "Acme Corp"
 *         position:
 *           type: string
 *           example: "Frontend Developer"
 *         status:
 *           type: string
 *           description: "One of: Pending, Reject, Interview Scheduled"
 *           example: "Pending"
 *         workType:
 *           type: string
 *           description: "One of: Full-Time, Part-Time, Internship, Contract"
 *           example: "Full-Time"
 *         workLocation:
 *           type: string
 *           example: "Mumbai"
 *
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1f3abcde4f9876543210f"
 *         company:
 *           type: string
 *         position:
 *           type: string
 *         status:
 *           type: string
 *         workType:
 *           type: string
 *         workLocation:
 *           type: string
 *         createdBy:
 *           type: string
 *           description: userId who created the job
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     JobsListResponse:
 *       type: object
 *       properties:
 *         totalJobs:
 *           type: integer
 *           example: 42
 *         jobs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Job'
 *         numOfPage:
 *           type: integer
 *           example: 5
 *
 *     JobStatsItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "Pending"
 *         count:
 *           type: integer
 *           example: 10
 *
 *     JobStatsResponse:
 *       type: object
 *       properties:
 *         Total_Jobs:
 *           type: integer
 *           example: 42
 *         stats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JobStatsItem'
 *
 *     TestRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Alice"
 *
 * tags:
 *   - name: Auth
 *     description: "Authentication endpoints (register, login)"
 *   - name: User
 *     description: "User profile endpoints"
 *   - name: Jobs
 *     description: "Job CRUD and stats"
 *   - name: Test
 *     description: "Internal / test endpoints"
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister'
 *           examples:
 *             simple:
 *               value:
 *                 name: "John"
 *                 email: "john@example.com"
 *                 password: "secret123"
 *     responses:
 *       201:
 *         description: User created successfully with JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               created:
 *                 value:
 *                   success: true
 *                   message: "User created"
 *                   user:
 *                     _id: "64a1f2c9b1e4f123456789ab"
 *                     name: "John"
 *                     lastname: ""
 *                     email: "john@example.com"
 *                     location: "India"
 *                     createdAt: "2024-01-01T12:00:00Z"
 *                     updatedAt: "2024-01-01T12:00:00Z"
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error (missing/invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing:
 *                 value:
 *                   success: false
 *                   message: "Name, email and password are required"
 *                   err: null
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               conflict:
 *                 value:
 *                   success: false
 *                   message: "Email already registered"
 *                   err: null
 *       500:
 *         description: Server error
 *
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user and receive JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *           examples:
 *             credentials:
 *               value:
 *                 email: "john@example.com"
 *                 password: "secret123"
 *     responses:
 *       200:
 *         description: Login successful, returns user and token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Login successful"
 *                   user:
 *                     _id: "64a1f2c9b1e4f123456789ab"
 *                     name: "John"
 *                     lastname: ""
 *                     email: "john@example.com"
 *                     location: "India"
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/user/update-user:
 *   put:
 *     tags:
 *       - User
 *     summary: Update authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           examples:
 *             update:
 *               value:
 *                 name: "John"
 *                 lastname: "Doe"
 *                 email: "john@example.com"
 *                 location: "Pune"
 *     responses:
 *       200:
 *         description: User updated + new token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *             examples:
 *               ok:
 *                 value:
 *                   user:
 *                     _id: "64a1f2c9b1e4f123456789ab"
 *                     name: "John"
 *                     lastname: "Doe"
 *                     email: "john@example.com"
 *                     location: "Pune"
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/job/create-job:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Create a new job (authenticated)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *           examples:
 *             create:
 *               value:
 *                 company: "Acme Corp"
 *                 position: "Frontend Developer"
 *                 status: "Pending"
 *                 workType: "Full-Time"
 *                 workLocation: "Mumbai"
 *     responses:
 *       201:
 *         description: Job created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *             examples:
 *               created:
 *                 value:
 *                   job:
 *                     _id: "64a1f3abcde4f9876543210f"
 *                     company: "Acme Corp"
 *                     position: "Frontend Developer"
 *                     status: "Pending"
 *                     workType: "Full-Time"
 *                     workLocation: "Mumbai"
 *                     createdBy: "64a1f2c9b1e4f123456789ab"
 *                     createdAt: "2024-01-02T08:00:00Z"
 *       400:
 *         description: Validation error (company/position required)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/job/get-job:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get jobs for the authenticated user (filter, search, sort, pagination)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status filter (e.g. Pending) or 'all'
 *       - in: query
 *         name: workType
 *         schema:
 *           type: string
 *         description: work type or 'all'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: case-insensitive search in position
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest, a-z, z-a]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of jobs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobsListResponse'
 *             examples:
 *               sample:
 *                 value:
 *                   totalJobs: 2
 *                   jobs:
 *                     - _id: "64a1f3abcde4f9876543210f"
 *                       company: "Acme Corp"
 *                       position: "Frontend Developer"
 *                       status: "Pending"
 *                       workType: "Full-Time"
 *                       workLocation: "Mumbai"
 *                       createdBy: "64a1f2c9b1e4f123456789ab"
 *                       createdAt: "2024-01-02T08:00:00Z"
 *                     - _id: "64a1f4abcde4f98765432110"
 *                       company: "Beta LLC"
 *                       position: "Backend Developer"
 *                       status: "Interview Scheduled"
 *                       workType: "Full-Time"
 *                       workLocation: "Pune"
 *                       createdBy: "64a1f2c9b1e4f123456789ab"
 *                       createdAt: "2024-01-03T09:00:00Z"
 *                   numOfPage: 1
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/job/update-job/{id}:
 *   patch:
 *     tags:
 *       - Jobs
 *     summary: Update a job by id (only owner)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *           examples:
 *             update:
 *               value:
 *                 position: "Senior Frontend Developer"
 *                 status: "Interview Scheduled"
 *     responses:
 *       200:
 *         description: Job updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updateJob:
 *                   $ref: '#/components/schemas/Job'
 *             examples:
 *               ok:
 *                 value:
 *                   updateJob:
 *                     _id: "64a1f3abcde4f9876543210f"
 *                     company: "Acme Corp"
 *                     position: "Senior Frontend Developer"
 *                     status: "Interview Scheduled"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden (not the owner)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/job/delete-job/{id}:
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: Delete a job by id (only owner)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job id
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               deleted:
 *                 value:
 *                   message: "Job deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/job/job-stats:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get job stats grouped by status for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated job stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobStatsResponse'
 *             examples:
 *               stats:
 *                 value:
 *                   Total_Jobs: 12
 *                   stats:
 *                     - _id: "Pending"
 *                       count: 5
 *                     - _id: "Interview Scheduled"
 *                       count: 4
 *                     - _id: "Reject"
 *                       count: 3
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/test/test-post:
 *   post:
 *     tags:
 *       - Test
 *     summary: Protected test endpoint - echoes provided name
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestRequest'
 *           examples:
 *             sample:
 *               value:
 *                 name: "Alice"
 *     responses:
 *       200:
 *         description: Returns provided name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               ok:
 *                 value:
 *                   message: "Your Name is Alice"
 *       401:
 *         description: Unauthorized
 */

//Routes
// Register
router.post("/register", limiter, registerController);

//Login
router.post("/login", limiter, loginController);

//Export
export default router;
