import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: true
    },
    ticket: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ticket', 
        required: true
    },
    numberOfSeats: {
        type: Number,
        required: [true, 'Please specify the number of seats to book'],
        min: [1, 'Number of seats must be at least 1']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
