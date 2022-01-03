const path = require('path');
const express = require('express');
//calling express-session
const session = require('express-session');
//adds our template engine handlebars
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

const app = express();
const PORT = process.env.PORT || 3001

const SequelizeStore = require('connect-session-sequelize')(session.Store);

//imports our .env that is using dotenv
require('dotenv').config();


const sess = {
    secret: 'DB_SECRET',
    cookie:{},
    resave:false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});