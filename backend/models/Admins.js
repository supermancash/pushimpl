import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});


const AdminSchema = mongoose.model("Admin", schema);

export default AdminSchema;
