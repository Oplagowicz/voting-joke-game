const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const Joke = require("./models/Joke.js")

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const addTestJoke = async () => {
    try {
      const jokeExists = await Joke.findOne({ question: "Why did the developer go broke?" });
      if (!jokeExists) {
        const joke = new Joke({
          question: "Why did the developer go broke?",
          answer: "Because he used up all his cache!",
          votes: [
            { value: 10, label: "😂" },
            { value: 5, label: "👍" },
            { value: 3, label: "❤️" }
          ]
        });
        await joke.save();
        console.log("Test joke added to MongoDB!");
      } else {
        console.log("Test joke already exists in database.");
      }
    } catch (error) {
      console.error("!Failed to add test joke:", error.message);
    }
  };
  
  connectDB().then(addTestJoke);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


