const Sequelize = require('sequelize');

module.exports = class Pot extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {//화분고유번호(아두이노)
                type: Sequelize.STRING(45),
                allowNull: false,
                primaryKey: true
            },
            name: {//화분 이름
                type: Sequelize.STRING(45),
                allowNull: false
            },
            plant: {//식물이름
                type: Sequelize.STRING(45),
                allowNull: false
            },
            setTem: {//설정온도
                type: Sequelize.FLOAT,
                allowNull: false
            },
            setHum: {//설정토양습도
                type: Sequelize.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Pot',
            tableName: 'pots',//DB의 테이블 이름
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Pot.hasMany(db.PotStatus, { foreignKey: 'potId', sourceKey: 'id', onDelete: 'cascade' });// 사용자-화분 1대다
        db.Pot.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });//화분-사용자 1대다
        //db.User.hasMany(db.Board, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });// 사용자-게시글 1대다
        //db.User.belongsToMany(db.Movie, { through:'UserMovie'});//사용자와 영화 다대다
    }
};