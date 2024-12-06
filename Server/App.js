const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const authRoutes = require("./routers/auth");
const getDataRouter = require("./routers/getData");
const setDataRouter = require("./routers/setData");

// PART-1: ================================== CREATE SOME VARIABLES TO USE ===============================================
// ConnectString to MongoDB Database
const MONGODB_URL =
  "mongodb+srv://quanganh1006:08032020@clustermongodb.g0asari.mongodb.net/assignment02";

// Create a session store for "ClientApp" to save session data
const clientSessionStore = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "clientSessions",
});

// Create a session store for "AdminApp" to save session data
const adminSessionStore = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "adminSessions",
});

// Check connection error for connect to session store
clientSessionStore.on("error", (error) => {
  console.error("User session store error:", error);
});

adminSessionStore.on("error", (error) => {
  console.error("Admin session store error:", error);
});

// PART-2: =================================== CREATE SOME MIDDLEWARES TO USE ===========================================
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
// app.use(cors()); // Allow to access data between two different domains
app.use(bodyParser.urlencoded({ extended: false })); // Allow to extract data from body property of request
app.use(express.json()); // Allow to extract JSON data from body property of request

// Middleware to create a collection("session") in "assignment02" to store data sessions
app.use(
  "/client",
  session({
    secret: "secretSession", // render a hashcode for ID of session and save to cookie, this cookie is saved in client browser
    resave: false, // Session is not saved after render a response for request
    saveUninitialized: false, // Session is not saved while have no any changes is created by request
    store: clientSessionStore, // Session is created will save to "clientSessionStore" ("clientSessionStore" points to collection("clientSessions") in "assignment02" database)
    // cookie: { httpOnly: false, maxAge: 10 * 1000 },
    cookie: { httpOnly: false, maxAge: 2 * 60 * 60 * 1000 },
  })
);

// Middleware to create a collection("session") in "assignment02" to store data sessions
app.use(
  "/admin",
  session({
    secret: "secretSession", // render a hashcode for ID of session and save to cookie, this cookie is saved in client browser
    resave: false, // Session is not saved after render a response for request
    saveUninitialized: false, // Session is not saved while have no any changes is created by request
    store: adminSessionStore, // Session is created will save to "adminSessionStore" ("adminSessionStore" points to collection("adminSessions") in "assignment02" database)
    // cookie: { httpOnly: false, maxAge: 50 * 1000 },
    cookie: { httpOnly: false, maxAge: 2 * 60 * 60 * 1000 },
  })
);

// PART-3: =============================== CALL ROUTERS FOR DIFFERENT PAGES IN APP PROJECT ===========================
// Authentication Routers:
app.use(authRoutes);
app.use(getDataRouter);
app.use(setDataRouter);

// PART-4: =================================== CREATE SEVER AND CONNECT TO SEVER =====================================
// Call the "connect()" method of mongoose to connect to "assignment02" database ("assignment02" is a MongoDB database)
mongoose
  .connect(MONGODB_URL)
  .then((connectResult) => {
    app.listen(5000, () => {
      console.log("Server is running in port 5000!");
    });
  })
  .catch((err) => console.log("Error information: ", err));
