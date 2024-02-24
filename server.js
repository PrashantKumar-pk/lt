require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;

const userRouter = require('./api/user')

const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user',userRouter)

app.listen(port, () => {
    console.log(`Server running in port ${port}`);
})