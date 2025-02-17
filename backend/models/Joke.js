import mongoose from "mongoose";

const jokeSchema = new mongoose.Schema({
    question: { type: String, required: true},
    answer: { type: String, required: true},
    votes: [
        {
            value: {type: Number, default: 0},
            label: {type: String, required: true},
            _id: false
        },
    ],
    availableVotes: {type: [String], default: ["😂", "👍", "❤️"]},

});

const JokeModel = mongoose.model("Joke", jokeSchema);
export default JokeModel;