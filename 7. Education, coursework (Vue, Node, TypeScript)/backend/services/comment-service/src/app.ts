// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import path from "node:path";
import {API_PREFIX} from "./utils/consts";
import cors from 'cors';
import commentRoutes from "./routes/comment.routes";

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(bodyParser.json());

app.use(`${API_PREFIX}comment`, commentRoutes);

export default app;
