var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var query = require('./query.js')


var app = express();

app.set('port', 9000);

app.use(morgan('dev'));

// body-parser to parse requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cookieParser());

var expiryDate = new Date(Date.now() + 60 * 60 * 48000); // 2 days
app.use(session({
    key: 'user_sid',
    secret: 'topSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: expiryDate,
        httpOnly: true,
//        secure: true // htpps only
    }
}));

//check user cookies
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


//check if user is logged-in
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/myDiet');
    } else {
        next();
    }
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

//create public directory
app.use(express.static('html'));
app.use(express.static('css'));
app.use(express.static('JavaScript'));
app.use(express.static('pict'));
app.use(express.static('path'));


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/html/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/myDiet');
            }
        });
    });

// route to myDiet
app.get('/myDiet', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/html/myDiet.html');
    } else {
        res.redirect('/login');
    }
});

app.get('/myDiet/getusermeals', query.getAllUserMeals, function(req,res){
    if (req.session.user && req.cookies.user_sid) {
        res.json(req.data);
    } else { res.redirect('/login'); }
});

// send meals to client
app.get('/createDiet/getMeals/:mealType', query.getMeals ,(req,res)=>{
    if (req.session.user && req.cookies.user_sid) {
        res.json(req.data);
    } else { res.redirect('/login'); }
});

//send user id and kcal to client
app.get('/createDiet/getIdKcal', (req, res)=>{
    if(req.session.user && req.cookies.user_sid){
        res.json({
            id: req.session.user.id,
            kcal: req.session.user.kcal
        });
    } else { res.redirect('/login'); }
});

// route to createDiet
app.get('/createDiet', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/html/createDiet.html');
    } else {
        res.redirect('/login');
    }
});

app.post('/createDiet',(req, res)=>{
    if (req.session.user && req.cookies.user_sid) {
        var meal = req.body;
        query.setUserMeals(meal, req.session.user.id);
        res.send(meal)
    } else {
        res.redirect('/login');
    }
});

app.post('/progress',(req, res)=>{
    if (req.session.user && req.cookies.user_sid) {
        var progress = req.body;
        var flag = true;

        for(k in progress){
            if(isNaN(progress[k])){
                res.status(400);
                flag = false;
                break;
            }else if(progress[k]==''){
                progress[k]='NULL';
            }
        }

        res.send(progress);
        if(flag){
            var date = new Date();
            date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            progress.user_id = req.session.user.id;
            progress.date = date;
            query.setUserProgress(progress);
        }

    } else {
        res.redirect('/login');
    }
});


app.post('/kcal',(req, res)=>{
    if (req.session.user && req.cookies.user_sid) {
        var kcal = req.body;
        var flag = true;

        for(k in kcal){
            if(isNaN(kcal[k])){
                res.status(400);
                console.log(kcal[k]);
                flag = false;
                break;
            }else if(kcal[k]==''){
                kcal[k]='NULL';
            }
        }

        res.send(kcal);
        if(flag){
            User.update(kcal,{where:{id:req.session.user.id}});
        }
    } else {
        res.redirect('/login');
    }
});


app.get('/createDiet/usermeals',query.getUserMeals,(req, res)=>{
    if (req.session.user && req.cookies.user_sid) {
        res.json(req.data);
    } else {
        res.redirect('/login');
    }
});

// route to progress
app.get('/progress', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/html/addProgress.html');
    } else {
        res.redirect('/login');
    }
});

app.get('/showProgress', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/html/showProgress.html');
    } else {
        res.redirect('/login');
    }
});


app.get('/showProgress/userprogress',query.getUserProgress, (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.json(req.data);
    } else {
        res.redirect('/login');
    }
});

app.get('/progress/getUserProp', query.getUserProp ,(req,res)=>{
    if (req.session.user && req.cookies.user_sid) {
        res.json(req.data);
    } else { res.redirect('/login'); }
});

// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
