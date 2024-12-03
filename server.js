import path from 'path';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
 
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import documentRoutes from "./routes/documentRoute.js"
import passport from "passport";
import session from "express-session";
// import "./config/passportConfig.js"; 
dotenv.config();  

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',   
  },
});

const port = process.env.PORT || 5000;

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,  
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,  
  message: 'Too many requests from this IP, please try again later.',
});

const allowedOrigins = ["http://localhost:5173","https://2a1a-2401-4900-900a-d9e9-bdff-3f49-16aa-2b1f.ngrok-free.app","https://tradeon.com.co/"]; // Your frontend URL

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allow cookies or authentication headers
}));  
// app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/', apiLimiter);
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(
  session({
    secret: "your_session_secret", 
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/document", documentRoutes);


if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

app.use(notFound);
app.use(errorHandler);

server.listen(port, () => console.log(`Server started on port ${port}`));

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
