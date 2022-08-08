const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {//아이디
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: true
            },
            password: {//비밀번호
                type: Sequelize.STRING(100),
                allowNull: false
            },
            name: {//이름
                type: Sequelize.STRING(20),
                allowNull: false
            },
            unregist: {
                type: Sequelize.BOOLEAN,
                default: false // false(0) means no unregist
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',//DB의 테이블 이름
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Pot, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });// 사용자-화분 1대다
        //db.User.hasMany(db.Board, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });// 사용자-게시글 1대다
        //db.User.belongsToMany(db.Movie, { through:'UserMovie'});//사용자와 영화 다대다
    }
};
