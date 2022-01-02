const router = require('express').Router();

const sequelize = require('sequelize');

const {User,Post,Comment} = require("../models");

router.get('/', (res,req) => {
    console.log();
})
