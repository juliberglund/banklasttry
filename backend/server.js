import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

let usersIds = 1;
let accountIds = 1;
let sessionIds = 1;

// Din kod här. Skriv dina arrayer
const users = [];
const accounts = [];
const sessions = [];

// Din kod här. Skriv dina routes:

app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  const userId = usersIds++;

  const user = { id: userId, username, password };
  users.push(user);

  const accountId = accountIds++;

  const account = { id: accountId, userId, amount: 0 };
  accounts.push(account);

  console.log("users", user);
  console.log("account", account);

  res.send("user created");
});

function getUser(username, password) {
  const user = users.find(
    (user) => user.username == username && user.password == password
  );
  return user;
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = getUser(username, password);

  if (user) {
    const token = generateOTP();
    const sessionId = sessionIds++;
    const session = { id: sessionId, userId: user.id, token };

    sessions.push(session);

    res.json(session);
  } else {
    res.send("Login faild");
  }
});

app.post("/me/accounts", async (req, res) => {
  const { token } = req.body;

  const session = sessions.find((session) => session.token == token);

  if (session) {
    const { userId } = session;
    const account = accounts.find((account) => account.userId == userId);

    res.json(account);
  } else {
    res.send("session ogiltig");
  }
});

app.post("/logout", (req, res) => {
  const { userId } = req.body;
  const session = sessions.filter((session) => session.userId != userId);
  res.json({ message: "Logout successful" });
});

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
