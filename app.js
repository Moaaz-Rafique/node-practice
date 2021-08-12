const express = require('express')
const app = express();
const userRoutes = require('./api/users')
const quizRoutes = require('./api/quizes')
const port=3001
const bodyParser = require('body-parser');
app.use(bodyParser());
// console.log(userRoutes)
app.use('/', userRoutes );
app.use('/', quizRoutes );

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/static/index.html')
})

app.listen(port, () => {
  console.log(`Login app listening at http://localhost:${port}`)
})