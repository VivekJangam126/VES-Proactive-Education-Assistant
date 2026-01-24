import express from "express";
import { getOrganisations } from "../controllers/organisation.controller.js";

const router = express.Router();

router.get("/", getOrganisations);

export default router;
