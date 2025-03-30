import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import virtualRoute from "./routes/virtualRoutes.js";
dotenv.config();

const app = express();
app.use(express.json()); 
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/myAssistant", virtualRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
