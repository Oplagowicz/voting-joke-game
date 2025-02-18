import React from "react";

function NextJoke({ fetchJoke }) {
    return (
        <button onClick={() => fetchJoke()}>
            Next Joke
        </button>
    );
}

export default NextJoke;