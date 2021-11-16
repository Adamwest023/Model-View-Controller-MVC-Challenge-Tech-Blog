const path = require('path');
const express = require('express');
//calling express-session
const session = require('express-session');
//adds our template engine handlebars
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001

const sequelize = require('sequelize');
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

  //express-session middleware
app.use(session(sess));

const hbs = exphbs.create({ helpers});

//middleware for our template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//middleware 
//allows the server.js to connect to other paths
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//the .static allows for folder contents to be used as static assets which is useful for front-end specific files
app.use(express.static(path.join(__dirname, '/public')));


//the routes variable is set up connecting all of our routes to one point 
app.use(require('./controllers/'));

// turn on connection to db and server
//The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables. 
//If it doesn't find a table, it'll create it for you!
//by force: true the database connection must sync with the model definitions and associations
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});