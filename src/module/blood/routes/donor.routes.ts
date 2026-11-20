import { Router } from "express";
import { donorController } from "../controllers/donor.controller.ts";

const router: Router = Router();

router.post("/", donorController.create);
router.get("/compatible", donorController.findCompatible);
router.get("/", donorController.list);
router.get("/:id", donorController.getById);
router.patch("/:id", donorController.update);
router.delete("/:id", donorController.remove);

export default router;
