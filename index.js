const { default: mongoose } = require("mongoose");
const { log, err } = require("./Utils/logger");
const { MONGODB_URI, PORT } = require("./Utils/config");
const app = require("./app");

mongoose.set('strictQuery', false)
log('connecting to mongoDB', MONGODB_URI)
mongoose.connect(MONGODB_URI)
    .then(()=>{
        log('connected to DB')
        app.listen(PORT ,()=>{
            log(`server running on http://127.0.0.1:${PORT}`)
        })        
    })
    .catch((error)=>{
        err('error connecting to DB', error)
    })