const mongoose = require("mongoose");

const jokeSchema = new mongoose.Schema({
    question: { type: String, required: true},
    answear: { type: String, required: true},
    votes: [
        {
            values: {type: Number, default: 0},
            label: {type: String, required: true},
        },
    ],
    availableVotes: {type: [String], default: ["😂", "👍", "❤️"]},

}, { timestamps: true });

const Joke = mongoose.model("Joke", jokeSchema);
module.exports = Joke;