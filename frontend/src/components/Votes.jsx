import React, { useState, useEffect } from "react";

function Votes({ jokeId, host }) {
    const [votes, setVotes] = useState([]);
    const [availableVotes, setAvailableVotes] = useState([]);

    useEffect(() => {
        fetch(`${host}/api/joke/${jokeId}`)
            .then(response => response.json())
            .then(data => {
                setVotes(data.votes || []);
                setAvailableVotes(data.availableVotes || []);
            })
            .catch(error => console.error("Error fetching votes:", error));
    }, [jokeId]);

    const handleVote = (emoji) => {
        fetch(`${host}/api/joke/${jokeId}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedEmoji: emoji })
        })
        .then(response => response.json())
        .then(updatedJoke => setVotes(updatedJoke.votes))
        .catch(error => console.error("Error voting:", error));
    };

    return (
        <div className="vote-buttons">
            {availableVotes.map((emoji) => {
                const vote = votes.find(v => v.label === emoji) || { value: 0, label: emoji };
                return (
                    <button key={emoji} onClick={() => handleVote(emoji)}>
                        {emoji} {vote.value}
                    </button>
                );
            })}
        </div>
    );
}

export default Votes;

