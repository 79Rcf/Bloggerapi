import express  from "express";
import cors from "cors"

import registerRoute from "./routes/register.js"
import loginRoute from "./routes/login.js"

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());



app.use("/register", registerRoute);
app.use("/login", loginRoute)

app.get('/', (req, res) => {
    res.send("server is runing live")
});

app.listen(port, () => {
    console.log(`sever is runnig on http://localhost:${port}`)
});

