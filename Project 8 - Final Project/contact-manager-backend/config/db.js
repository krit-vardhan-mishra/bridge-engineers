import { connect } from "mongoose";

const connectDB = async () => {
    try {
        await connect('mongodb://localhost:27017/contact-manager');
        console.log('Connected successfully...!');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

export default connectDB;