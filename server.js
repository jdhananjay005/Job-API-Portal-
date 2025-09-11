// Pcackages mports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
// Files Imports
import connectDB from "./config/db.js";
//Routes Import
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobsRoutes.js";

//API Documentation
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

//Security Packages
import helmet from "helmet";

//dot env configuration
dotenv.config({ silent: true });

// MongoDB Connection
connectDB();

//swagger API Config
//swagger API Options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      version: "1.0.0",
      description: "Node Express JS Portal Application",
    },
    servers: [
      {
        url: "https://job-api-portal.onrender.com/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

//Rest Objects
const app = express();

//middleware
app.use(express.json()); //body parser
app.use(cors()); // cross origin resource sharing
app.use(morgan("dev")); // http request logger middleware for node.js
app.use(helmet()); // preventing for the security headers

//Routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);

//homeroutes root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// validation Middlewares
app.use(errorMiddleware);

//Port configuration
const PORT = process.env.PORT || 8000;

// listen on port 8000
app.listen(PORT, () => {
  console.log(`Node Server running in ${process.env.DEV_MODE} on port ${PORT}`);
});
