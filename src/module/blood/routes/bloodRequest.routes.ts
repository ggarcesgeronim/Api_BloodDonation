import { Router } from "express";
import { bloodRequestController } from "../controllers/bloodRequest.controller.ts";

const router: Router = Router();

router.post("/", bloodRequestController.create);
router.get("/", bloodRequestController.list);
router.get("/:id/compatible-donors", bloodRequestController.getCompatibleDonors);
router.get("/:id", bloodRequestController.getById);
router.patch("/:id", bloodRequestController.update);
router.delete("/:id", bloodRequestController.remove);

export default router;
