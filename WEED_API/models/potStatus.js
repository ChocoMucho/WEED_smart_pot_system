const Sequelize = require('sequelize');

module.exports = class PotStatus extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            temp: {//실시간 온도
                type: Sequelize.FLOAT,
                allowNull: false
            },
            hum: {//실시간 습도
                type: Sequelize.INTEGER,
                allowNull: false
            },
            time: {//생성 된 시간
                type: Sequelize.DATE,
                allowNull: false
            },
            potId: {//화분고유번호(아두이노)
                type: Sequelize.STRING(45),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'PotStatus',
            tableName: 'potStatus',//DB의 테이블 이름
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.PotStatus.belongsTo(db.Pot, { foreignKey: 'potId', targetKey: 'id' });
        // db.User.hasMany(db.Comment, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });// 사용자-코멘트 1대다
        // db.User.hasMany(db.Board, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' });// 사용자-게시글 1대다
        //db.User.belongsToMany(db.Movie, { through:'UserMovie'});//사용자와 영화 다대다
    }
};