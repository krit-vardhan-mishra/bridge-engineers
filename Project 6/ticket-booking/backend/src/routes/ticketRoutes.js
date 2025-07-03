import express from "express";
import { bookTicket, cancelBooking, createTicket, deleteTicket, getTicketById, getTickets, getTicketsByUser, updateTicket } from "../controller/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTickets);
router.get("/:id", getTicketById);

router.post("/", protect, createTicket);
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

router.post("/:id/book", protect, bookTicket);
router.post("/:id/cancel", protect, cancelBooking);

router.get("/my-tickets", protect, getTicketsByUser);

export default router;