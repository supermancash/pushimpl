import mongoose from "mongoose";

const schema = new mongoose.Schema({
    endpoint: {type: String, unique: true, required: true},
    expirationTime: {type: Number, required: false},
    keys: {
        auth: String,
        p256dh: String,
    }
});


const SubscriberSchema = mongoose.model("Subscriber", schema);

export default SubscriberSchema;
