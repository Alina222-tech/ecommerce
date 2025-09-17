const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const userroutes = require("./routes/user.routes.js");
const productroute = require("./routes/productroutes.js");
const cardroute = require("./routes/card.routes.js");

dotenv.config();

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));


app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:5173", 
    
    credentials: true
}));


app.use("/user", userroutes);
app.use("/product", productroute);
app.use("/cart", cardroute);

const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Database is connected.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
    console.error("Database connection error:", err);
});
