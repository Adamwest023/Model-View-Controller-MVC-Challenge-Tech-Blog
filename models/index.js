//import models
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');


//creates associations between models
User.hasMany(Post, {
  //connects to post through the user_id that is connected to the User(id)
  foreignKey: 'user_id'
});

//reverse association by adding the following statement 
//post can belong to one user, not many users
Post.belongsTo(User, {
  //using same foreign key
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  hooks:true
});
//exports the Model as an object with Model as a property
module.exports = { User, Post, Comment };
