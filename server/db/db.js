const mongoose = require('mongoose')

mongoose.connect(process.env.MOVIES_MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});