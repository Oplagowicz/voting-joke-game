import React, { useState, useEffect } from 'react';
import Joke from './components/Joke';
import Votes from './components/Votes';
import NextJoke from './components/NextJoke';

function App() {
    const [joke, setJoke] = useState(null);
    const [shownJokes, setShownJokes] = useState(new Set());

    const fetchJoke = (retryCount = 0) => {
        fetch("http://localhost:5000/api/joke")
            .then(response => response.json())
            .then(data => {
                console.log("New joke received:", data);

                if (shownJokes.has(data._id)) {
                    console.warn(`Duplicate joke detected (attempt ${retryCount + 1}), retrying...`);

                    if (retryCount < 5) {
                        setTimeout(() => fetchJoke(retryCount + 1), 500);
                    } else {
                        console.warn("Too many retries, showing duplicate joke.");
                        setJoke(data);
                    }
                } else {
                    setJoke(data);
                    setShownJokes(prev => new Set([...prev, data._id]));
                }
            })
            .catch(error => console.error("Error fetching joke:", error));
    };

    useEffect(() => {
        fetchJoke();
    }, []);

    return (
        <div>
            {joke && (
                <>
                    <Joke joke={joke} />
                    <Votes jokeId={joke._id} />
                    <NextJoke fetchJoke={fetchJoke} />
                </>
            )}
        </div>
    );
}

export default App;
