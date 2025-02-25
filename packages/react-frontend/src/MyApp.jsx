// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
  
    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }
        else {
          console.log('Failed to add user. Status: ${response.status}');
        }
      })
      .then((newUser) => {
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeOneCharacter(index) {
    const characterToRemove = characters[index];

    fetch(`http://localhost:8000/users/${characterToRemove._id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          const updated = characters.filter((_, i) => i !== index);
          setCharacters(updated);
        } else if (response.status === 404) {
          console.log("User not found on the backend.");
        } else {
          console.log("Failed to delete user. Status:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error during delete operation:", error);
      });
  }

  /*function updateList(person) {
    setCharacters([...characters, person]);
  }*/

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );

}

export default MyApp;
