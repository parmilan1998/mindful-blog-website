import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route";

const app = express();

// Adds security-related HTTP headers
app.use(helmet());

// Enable CORS (allow frontend apps to access APIs)
app.use(cors());

// Log HTTP requests in development format
app.use(morgan("dev"));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Parse cookies from request headers
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`
   <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Server Status</title>

    <!-- Google Font: Lora -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    >

    <style>
        body {
        margin: 0;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Lora', serif;
        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        color: #fff;
        }

        .card {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(12px);
        padding: 36px 44px;
        border-radius: 14px;
        text-align: center;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
        max-width: 420px;
        }

        h1 {
        margin: 0 0 12px;
        font-size: 30px;
        font-weight: 600;
        letter-spacing: 0.5px;
        }

        p {
        margin: 8px 0;
        opacity: 0.9;
        font-size: 16px;
        }

        .status {
        margin-top: 18px;
        display: inline-block;
        padding: 8px 18px;
        border-radius: 24px;
        background: #22c55e;
        color: #0f172a;
        font-weight: 600;
        font-size: 14px;
        }

        .footer {
        margin-top: 22px;
        font-size: 13px;
        opacity: 0.75;
        }
    </style>
    </head>

    <body>
    <div class="card">
        <h1>🚀 Server Running</h1>
        <p>Your backend server is up and running successfully.</p>
        <div class="status">Status: ONLINE</div>
       <div class="footer"> Express • Node.js<br/> ${new Date().toLocaleString()} </div>
    </div>
    </body>
    </html>
  `);
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);

export default app;
