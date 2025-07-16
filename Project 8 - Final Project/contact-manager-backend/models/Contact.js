import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: { type: String, require: true},
    email: { type: String },
    phone: { type: String },
}, { timestamps: true });

const Contact = model('Contact', contactSchema);
export default Contact;