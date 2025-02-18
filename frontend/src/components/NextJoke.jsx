import React from "react";

function NextJoke({ fetchJoke }) {
    return (
        <div className="bottom-nav">
        <button className="next-joke-button" onClick={() => fetchJoke()}>
            Next Joke
        </button>
        </div>
    );
}

export default NextJoke;