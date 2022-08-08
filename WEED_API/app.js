const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const nunjucks = require('nunjucks');
const { sequelize } = require('./models');

const passport = require('passport');
const passportConfig = require('./passport');

const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const mainRouter = require('./routes/main');
const potRouter = require('./routes/pot');
const indexRouter = require('./routes');

dotenv.config();
passportConfig();

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
  .then(() => console.log('데이터베이스 연결 성공'))
  .catch(err => console.error(err));

app.use(
    morgan('dev'),
    express.static(path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.SECRET),
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
        isAdded: false,
        isDeleted: false,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/home', mainRouter);
app.use('/user', userRouter);
app.use('/pot', potRouter);
app.use('/', indexRouter);

app.use((req, res, next) => { 
    res.locals.title = require('./package.json').name; 
    res.locals.port = app.get('port'); //nunjucks를 사용하게 되면 title, port를 html파일에서 활용할 수 있다.
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.render('index'); //응답할때 render함수를 통해서 index를 전달하면 views폴더 안에서 index.html을 읽어서 응답, render함수 자체가 configure함수를 호출함.
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

module.exports = app;
