import express from "express";
import cors from "cors";
import paginate from "express-paginate";

import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import meRoute from "./routes/me.js";
import profileUploadRoute from "./routes/profileUpload.js";
import postsRoute from "./routes/posts.js";       // GET /posts & POST /posts
import postsByIdRoute from "./routes/postsById.js"; // GET /posts/:id
import postsUpdateRoute from "./routes/postsUpdate.js"
import postsDeleteRoute from "./routes/postsDelete.js"
import postCommentsRoute from "./routes/postComment.js";
import commentsRoute from "./routes/comments.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/me", meRoute);
app.use("/profile_upload", profileUploadRoute);
app.use("/comments", commentsRoute);
// Pagination middleware
app.use(paginate.middleware(10, 50));

// Posts routes
app.use("/posts", postsRoute);       // GET /posts (pagination) & POST /posts
app.use("/posts", postsByIdRoute);    // GET /posts/:id
app.use("/posts", postsUpdateRoute);
app.use("/posts", postsDeleteRoute);
app.use("/posts", postCommentsRoute);

// Global Error Handler
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("server is running live");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
