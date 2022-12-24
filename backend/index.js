
const mongoose = require("mongoose")
const express = require('express')
const app = express()
app.use(express.json());
mongoose.connect("mongodb+srv://bushra:euVDEv190AGHYJDI@cluster0.nwfddcm.mongodb.net/AKM?retryWrites=true&",
    { useNewUrlParser: true, })
    .then(() => {
        console.log("MongoDB Connected.");
    }).catch((err) => {
        console.log(err);
    });

const port = 3000
app.use("/api/auth", require("./routes/auth"))
//  app.use("/api/notes",require("./routes/notes"))
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening  at http://localhost:${port}`)
})