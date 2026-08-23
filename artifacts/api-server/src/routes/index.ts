import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketRouter from "./market";
import battlesRouter from "./battles";

const router: IRouter = Router();

router.use(healthRouter);
router.use(battlesRouter);
router.use(marketRouter);

export default router;
