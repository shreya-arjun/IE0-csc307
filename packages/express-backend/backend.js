// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
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
  };


const randomID = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
  

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

//get users with name and job
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
  });

//get users with id
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  res.status(201).send(addedUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let deletedUser = findUserById(id);

  if (deletedUser) {
    users["users_list"] = users["users_list"].filter((user) => user.id !== id);
    res.status(204).send(); // Success: No Content
  } else {
    res.status(404).send({ message: "User not found." }); // User not found
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

