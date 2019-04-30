const express = require('express');
const app = express()
var jade = require('jade')
const path = require('path')

app.set('views',path.join(__dirname , '/views'))
app.set('view engine', 'jade')


const port=process.env.PORT||3000;
app.listen(port, function(err){
    if(err) throw err;
    console.log(`Server is running at ${port}`);
});

const userRouter = require('./routes/users');

const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('views'));
app.use('/uploads', express.static('uploads'));
app.use('/',userRouter);
