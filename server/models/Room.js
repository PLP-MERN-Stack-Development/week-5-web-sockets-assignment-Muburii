const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
}, {tmestamps: true});


module.exports = mongoose.model("Room", roomSchema);