import { Router } from "express";
import bloodRequestRoutes from "./bloodRequest.routes.ts";
import donorRoutes from "./donor.routes.ts";

const router: Router = Router();

router.use("/blood-requests", bloodRequestRoutes);
router.use("/donors", donorRoutes);

export default router;
