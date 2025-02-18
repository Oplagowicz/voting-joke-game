import express from "express";
import fetch from "node-fetch";
import JokeModel from "../models/Joke.js";

const jokesRouter = express.Router();


const allowedEmojis = ["😂", "👍", "❤️"];

const generateJoke = async () => {
  try {
    const response = await fetch("https://teehee.dev/api/joke");
    const jokeData = await response.json();

    if (jokeData && jokeData.question && jokeData.answer) {
      const newJoke = new JokeModel({
        question: jokeData.question,
        answer: jokeData.answer,
        votes: allowedEmojis.map((emoji) => ({ label: emoji, value: 0 })),
      });

      await newJoke.save();
      return newJoke;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching joke from API:", error);
    return null;
  }
};



jokesRouter.get("/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    let result = null;

    if (id) {
      result = await JokeModel.findById(id);
      if (!result) {
        return res.status(404).json({ message: "Joke not found" });
      }
    } else {
      if (!global.usedJokesIds) {
        global.usedJokesIds = [];
      }

      const storedJokes = await JokeModel.find();

      if (storedJokes.length === 0) {
        console.log("No jokes in database, fetching a new one...");
        result = await generateJoke();
        if (!result) {
          return res.status(404).json({ message: "No jokes found from API" });
        }
      } else {
        let availableJokes = storedJokes.filter(joke => !global.usedJokesIds.includes(joke._id.toString()));

        if (availableJokes.length === 0) {
          console.log("All jokes have been used in this session. Fetching a new one...");
          global.usedJokesIds = [];

          result = await generateJoke();
          if (!result) {
            return res.status(404).json({ message: "No new jokes available from API" });
          }
        } else {
          result = availableJokes[Math.floor(Math.random() * availableJokes.length)];
        }
      }
    }

    if (result && !global.usedJokesIds.includes(result._id.toString())) {
      global.usedJokesIds.push(result._id.toString());
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching joke" });
  }
});


jokesRouter.post("/:id/vote", async (req, res) => {
  try {
    const { selectedEmoji } = req.body;
    if (!allowedEmojis.includes(selectedEmoji)) {
      return res.status(400).json({ error: "Invalid emoji for voting" });
    }

    const jokeToUpdate = await JokeModel.findById(req.params.id);
    if (!jokeToUpdate) return res.status(404).json({ message: "Joke not found" });

    const existingVote = jokeToUpdate.votes.find((vote) => vote.label === selectedEmoji);
    if (existingVote) {
      existingVote.value += 1;
    } else {
      jokeToUpdate.votes.push({ label: selectedEmoji, value: 1 });
    }

    await jokeToUpdate.save();
    res.json(jokeToUpdate);
  } catch (error) {
    res.status(500).json({ error: "Error while processing vote request" });
  }
});

jokesRouter.delete("/:id", async (req, res) => {
  try {
    const deletedJoke = await JokeModel.findByIdAndDelete(req.params.id);
    if (!deletedJoke) return res.status(404).json({ message: "Joke not found" });
    res.json({ message: "Joke deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the joke" });
  }
});

jokesRouter.put("/:id", async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "Both question and answer are required" });
    }

    const updatedJoke = await JokeModel.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true }
    );

    if (!updatedJoke) return res.status(404).json({ message: "Joke not found" });
    res.json(updatedJoke);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the joke" });
  }
});


export default jokesRouter;
