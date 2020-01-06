import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get("/", (_: Request, res: Response, _2: NextFunction) => {
  res.send("domo world");
});

export default router;
