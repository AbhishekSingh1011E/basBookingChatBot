import { Router } from "express";
import { getChat, handleChat } from "../controller/chat.controller.js";

const chatRouter = Router();

chatRouter.route("/").post(handleChat);
chatRouter.route("/history").post(getChat);

export default chatRouter;
