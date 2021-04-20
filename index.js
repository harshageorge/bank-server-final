// 1XX-client clientInformation
// 2XX-SUCCESS
// 3XX-REDIRECT
// 4XX-CLIENT ERROR
// 5XX-SERVER ERROR




const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dataService = require('./services/data.service');

const app = express();
app.use(cors({
    origin:'http://localhost:4200',
    credentials:true   //to get cookies
}))

app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false

}))
const logMidlleware = (req, res, next) => {
    console.log(req.body);
    next()
}

//app.use(logMidlleware);

const authMiddleware = (req, res, next) => {
    if (!req.session.currentuser) {
        return res.json({
            status: false,
            statusCode: 401,
            message: "please log in",

        })
    }
    else {
        next()
    }

}



app.use(express.json()); //parsing to object

// app.get('/',(req,res)=>{
//     res.status(404).send("GET METHOD UPDATED")
// })




app.post('/register', (req, res) => {
    // console.log(req.body);
     dataService.register(req.body.acno, req.body.username, req.body.password)
        //res.status(200).send("sucess");
        .then(result => { res.status(result.statusCode).json(result) })


})
//    res.status(result.statusCode);
//    console.log(res.json(result));
//console.log(res.status(result.statusCode).json(result));




app.post('/login', (req, res) => {
    // console.log(req.body);
    dataService.login(req, req.body.acno, req.body.password)
    .then(result => { res.status(result.statusCode).json(result) })



})

app.post('/deposit', authMiddleware, (req, res) => {
   // console.log(req.session.currentuser);
     dataService.deposit(req.body.acno, req.body.password, req.body.amount)
     .then(result => { res.status(result.statusCode).json(result) })
})

app.post('/withdraw', authMiddleware, (req, res) => {
    // console.log(req.body);
    dataService.withdraw(req,req.body.acno, req.body.password, req.body.amount)
     .then(result => { res.status(result.statusCode).json(result) })
})

app.delete('/deleteAccDetails/:acno', authMiddleware, (req, res) => {
    // console.log(req.body);
    dataService.deleteAccDetails(req.params.acno)
     .then(result => { res.status(result.statusCode).json(result) })
    
})

// app.delete('/deleteAccDetails/:acno', authMiddleware, (req, res) => {
//     res.send("Delete METHOD")
// })

app.listen(3000, () => { console.log("Server started at port 3000") })
// app.put('/',(req,res)=>{
//     res.send("PUT METHOD")
// })

// app.patch('/',(req,res)=>{
//     res.send("PATCH METHOD")
// })


// app.delete('/',(req,res)=>{
//     res.send("DELETE METHOD")
// })

