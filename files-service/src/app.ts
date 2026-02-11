import express, { type Request, type Response } from "express";
import { router } from "./routers/index.router.ts";

export const app = express();

app.use(express.json());

// Others middleware

app.use('/api', router);
