const Sequelize = require('sequelize');
const User = require('./user');
const Pot = require('./pot');
const PotStatus = require('./potStatus');
// const Comment = require('./comment');
// const Movie = require('./movie');
// const Genre = require('./genre');
// const Board = require('./board');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Pot = Pot;
db.PotStatus = PotStatus;
// db.Comment = Comment;
// db.Movie = Movie;
// db.Genre = Genre;
// db.Board = Board;

User.init(sequelize);
Pot.init(sequelize);
PotStatus.init(sequelize);
// Comment.init(sequelize);
// Movie.init(sequelize);
// Genre.init(sequelize);
// Board.init(sequelize);

User.associate(db);
Pot.associate(db);
PotStatus.associate(db);
// Comment.associate(db);
// Movie.associate(db);
// Genre.associate(db);
// Board.associate(db);

module.exports = db;


