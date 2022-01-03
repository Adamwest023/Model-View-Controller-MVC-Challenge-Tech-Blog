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
//imports our .env that is using dotenv
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'DB_SECRET',
    cookie:{},
    resave:false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
      checkExpirationInterval: 60 * 1000,
      expiration: 60 * 60 * 1000
    })
  };

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, '/public')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});