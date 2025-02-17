import React, { useState, useEffect } from "react";

function Joke() {
    const [joke, setJoke] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/joke")
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch joke");
                return response.json();
            })
            .then(data => {
                setJoke(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading joke...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>{joke.question}</h2>
            <p>{joke.answer}</p>
        </div>
    );
}

export default Joke;
