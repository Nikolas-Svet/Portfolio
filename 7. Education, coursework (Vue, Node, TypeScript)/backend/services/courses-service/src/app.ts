// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import path from "node:path";
import {API_PREFIX} from "./utils/consts";
import cors from 'cors';
import courseRoutes from "./routes/course.routes";

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads_courses', express.static(path.join(__dirname, '../uploads_courses')));

app.use(bodyParser.json());

app.use(`${API_PREFIX}courses`, courseRoutes);

export default app;
