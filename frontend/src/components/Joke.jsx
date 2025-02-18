import React, { useState, useEffect } from "react";

function Joke({ joke }) {
    return (
        <div>
            <h2>{joke.question}</h2>
            <p>{joke.answer}</p>
        </div>
    );
}

export default Joke;
