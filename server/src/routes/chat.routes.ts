import { Router } from "express";
import * as roomController from "../controllers/room.controller.js";

const router = Router();

router.post("/rooms", roomController.createRoom);
router.get("/rooms", roomController.getRooms);
router.post("/join", roomController.joinChat);
router.post("/message", roomController.sendMessage);
router.get("/messages/:roomId", roomController.getRoomMessages);

export default router;
