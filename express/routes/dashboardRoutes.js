import express from "express";
import { requireAdmin } from "../middlewares/admin.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get('/dashboard', requireAdmin, getDashboardData);

export default dashboardRoutes;