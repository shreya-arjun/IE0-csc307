// backend.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

/*const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  }; */


/*const randomID = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}*/
  
const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  user.id = randomID();
  users["users_list"].push(user);
  return user;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// get all users, or filter by name/job
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  userService
    .getUsers(name, job)
    .then((users) => res.send({ users_list: users }))
    .catch((error) => {
      console.error("Error finding users:", error);
      res.status(500).send({ message: "Internal Server Error" });
    });
});

/* get users with name and job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result = users["users_list"];
  
  if (name != undefined) {
    result = findUserByName(name);
  }

  if (job != undefined) {
    result = result.filter((user) => user["job"] === job);
  }

  res.send({users_list:result});
});

//get users with name
app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

//get all users
app.get("/users", (req, res) => {
  res.send(users);
  }); */

// GET user by ID
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .findUserById(id)
    .then((user) => {
      if (user) res.send(user);
      else res.status(404).send({ message: "User not found." });
    })
    .catch((error) => {
      console.error("Error finding user:", error);
      res.status(500).send({ message: "Internal Server Error" });
    });
});

/*//get users with id
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
}); */

// POST - Add a new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((addedUser) => res.status(201).send(addedUser))
    .catch((error) => {
      console.error("Error adding user:", error);
      res.status(500).send({ message: "Internal Server Error" });
    });
});

/*
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  res.status(201).send(addedUser);
}); */

// DELETE user by ID
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .deleteUserById(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send({ message: "User not found." });
      }
      res.status(204).send();
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      res.status(500).send({ message: "Internal Server Error" });
    });
});

/*
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let deletedUser = findUserById(id);

  if (deletedUser) {
    users["users_list"] = users["users_list"].filter((user) => user.id !== id);
    res.status(204).send(); // Success: No Content
  } else {
    res.status(404).send({ message: "User not found." }); // User not found
  }
});*/

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

