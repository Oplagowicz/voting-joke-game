import express from "express";
import fetch from "node-fetch";
import JokeModel from "../models/Joke.js";

const jokesRouter = express.Router();


const allowedEmojis = ["😂", "👍", "❤️"];


const fetchJokeFromAPI = async () => {
  try {
    const response = await fetch("https://teehee.dev/api/joke");
    const jokeData = await response.json();
    
    if (jokeData && jokeData.question && jokeData.answer) {
      const newJoke = new JokeModel({
        question: jokeData.question,
        answer: jokeData.answer,
        votes: allowedEmojis.map((emoji) => ({ label: emoji, value: 0 })), 
        availableVotes: allowedEmojis,
      });
      await newJoke.save();
      return newJoke;
    }
  } catch (error) {
    console.error("!!Error fetching joke from TeeHee API:", error.message);
  }
  return null;
};

jokesRouter.get("/", async (req, res) => {
  try {
    const storedJokes = await JokeModel.find().lean();
    
    if (storedJokes.length > 0) {
      const randomJoke = storedJokes[Math.floor(Math.random() * storedJokes.length)];
      return res.json(randomJoke);
    }

    const externalJoke = await fetchJokeFromAPI();
    if (externalJoke) return res.json(externalJoke);

    res.status(404).json({ message: "!!No jokes found and external API unavailable" });
  } catch (error) {
    res.status(500).json({ error: "!!Server encountered an issue while retrieving jokes" });
  }
});

export default jokesRouter;
