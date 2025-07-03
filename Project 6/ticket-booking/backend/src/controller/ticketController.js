import Ticket from '../models/Ticket.js';
import Booking from '../models/Booking.js';
import { isValidObjectId, handleError, withMongoSession, extractTicketFields } from '../utils/helpers.js';

// Create a new ticket
export async function createTicket(req, res) {
    try {
        const data = { ...extractTicketFields(req.body), user: req.user.id };
        await Ticket.create(data);
        return res.status(201).json({ success: true, message: "Ticket created successfully!" });
    } catch (error) {
        return handleError(res, error, "Error creating ticket");
    }
}

// Get all tickets
export async function getTickets(_, res) {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        return res.status(200).json(tickets);
    } catch (error) {
        return handleError(res, error, "Error fetching tickets");
    }
}

// Get a ticket by ID
export async function getTicketById(req, res) {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid Ticket ID." });
    }

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found." });
        return res.status(200).json(ticket);
    } catch (error) {
        return handleError(res, error, "Error fetching ticket");
    }
}

// Update a ticket
export async function updateTicket(req, res) {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid Ticket ID." });
    }

    try {
        const data = extractTicketFields(req.body);
        const updated = await Ticket.findByIdAndUpdate(id, data, { new: true });

        if (!updated) return res.status(404).json({ message: "Ticket not found." });

        return res.status(200).json({ message: "Ticket updated successfully!" });
    } catch (error) {
        return handleError(res, error, "Error updating ticket");
    }
}

// Delete a ticket
export async function deleteTicket(req, res) {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid Ticket ID." });
    }

    try {
        const deleted = await Ticket.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Ticket not found." });
        return res.status(200).json({ message: "Ticket deleted successfully!" });
    } catch (error) {
        return handleError(res, error, "Error deleting ticket");
    }
}

// Book a ticket
export async function bookTicket(req, res) {
    const ticketId = req.params.id;
    const userID = req.user.id;
    const { numberOfSeats } = req.body;

    if (!isValidObjectId(ticketId)) {
        return res.status(400).json({ message: "Invalid Ticket ID format." });
    }

    if (!numberOfSeats || numberOfSeats <= 0) {
        return res.status(400).json({ message: "Please specify a valid number of seats." });
    }

    try {
        const booking = await withMongoSession(async (session) => {
            const ticket = await Ticket.findById(ticketId).session(session);
            if (!ticket) throw { status: 404, message: "Ticket not found." };

            if (ticket.status === 'sold_out' || ticket.status === 'cancelled' || ticket.availableSeats < numberOfSeats) {
                throw { status: 400, message: `Not enough available seats. Only ${ticket.availableSeats} left.` };
            }

            ticket.availableSeats -= numberOfSeats;
            ticket.bookedSeats += numberOfSeats;
            if (ticket.availableSeats === 0) ticket.status = 'sold_out';

            await ticket.save({ session });

            const [booking] = await Booking.create([{
                user: userID,
                ticket: ticketId,
                numberOfSeats,
                status: 'confirmed'
            }], { session });

            return booking;
        });

        return res.status(201).json({ success: true, message: "Ticket booked successfully!", data: booking });
    } catch (error) {
        return handleError(res, error, error.message || "Error booking ticket", error.status || 500);
    }
}

// Cancel a booking
export async function cancelBooking(req, res) {
    const bookingId = req.params.id;
    const userId = req.user.id;

    if (!isValidObjectId(bookingId)) {
        return res.status(400).json({ message: "Invalid Booking ID format." });
    }

    try {
        const booking = await withMongoSession(async (session) => {
            const booking = await Booking.findOne({ _id: bookingId, user: userId }).session(session);
            if (!booking) throw { status: 404, message: "Booking not found or unauthorized." };
            if (booking.status === 'cancelled') throw { status: 400, message: "Booking already cancelled." };

            const ticket = await Ticket.findById(booking.ticket).session(session);
            if (!ticket) throw { status: 404, message: "Associated ticket not found." };

            ticket.availableSeats += booking.numberOfSeats;
            ticket.bookedSeats -= booking.numberOfSeats;
            if (ticket.status === 'sold_out' && ticket.availableSeats > 0) ticket.status = 'available';

            await ticket.save({ session });

            booking.status = 'cancelled';
            await booking.save({ session });

            return booking;
        });

        return res.status(200).json({ success: true, message: "Booking cancelled successfully!", data: booking });
    } catch (error) {
        return handleError(res, error, error.message || "Error cancelling booking", error.status || 500);
    }
}

// Get bookings by user
export async function getTicketsByUser(req, res) {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ user: userId })
            .populate('ticket')
            .sort({ bookingDate: -1 });

        if (!bookings.length) {
            return res.status(404).json({ success: false, message: "No bookings found for this user." });
        }

        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        return handleError(res, error, "Error fetching user bookings");
    }
}