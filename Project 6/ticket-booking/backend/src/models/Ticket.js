import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a ticket title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    eventDate: {
        type: Date,
        required: [true, 'Please add an event date']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price cannot be negative']
    },
    totalSeats: {
        type: Number,
        required: [true, 'Please add the total number of seats'],
        min: [1, 'Total seats must be at least 1']
    },
    availableSeats: {
        type: Number,
        required: true,
        default: function() {
            return this.totalSeats;
        },
        min: [0, 'Available seats cannot be negative']
    },
    bookedSeats: {
        type: Number,
        default: 0,
        min: [0, 'Booked seats cannot be negative']
    },
    status: {
        type: String,
        enum: ['available', 'sold_out', 'cancelled'],
        default: 'available'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ticketSchema.pre('save', function(next) {
    if (this.isModified('availableSeats') || this.isModified('bookedSeats')) {
        if (this.availableSeats < 0) {
            this.availableSeats = 0;
        }
        if (this.bookedSeats < 0) {
            this.bookedSeats = 0;
        }
        if (this.availableSeats + this.bookedSeats > this.totalSeats) {
            this.availableSeats = this.totalSeats - this.bookedSeats;
            if (this.availableSeats < 0) this.availableSeats = 0;
        }
    }
    next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;