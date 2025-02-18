import React from "react";

function Joke({ joke }) {
    return (
        <div className="joke-container">
            <h2 className="joke-question">{joke.question}</h2>
            <p className="joke-answer">{joke.answer}</p>
        </div>
    );
}

export default Joke;
