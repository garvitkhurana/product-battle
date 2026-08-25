import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketRouter from "./market";
import ogRouter from "./og";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ogRouter);
router.use(marketRouter);

export default router;
