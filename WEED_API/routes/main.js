const express = require('express');
const {User, Pot, PotStatus} = require('../models');
const Sequelize = require('sequelize');
const {isLoggedIn} = require('./helpers');
const {max} = require('../models/user');
const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    console.log('메인사이트 접속');
    const statusIndex = [];
    const stat = []

    try {
        console.log("접속자 아이디 : ",req.user.id);
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        }); //세션에 로그인 된 아이디로 행을 찾음

        const pots = await user.getPots({raw: true}); // 화분정보를 전부 가져옴
        
        for( const i of pots ) {//로그인 한 계정 화분의 status 중 가장 큰 인덱스 값들 배열에 푸시
            potId = i.id;
            const index = await PotStatus.max('id',{
                where: { potId },
                raw: true
            })
            console.log(index)
            statusIndex.push(index);
            
        }
        for( const i of statusIndex){//해당 인덱스 값의 행 정보들 배열에 푸시
            const allstat = await PotStatus.findOne({
                where: { id: i},
                raw: true
            })
            stat.push(allstat)
        }
        
        res.locals.user = req.user;
        res.locals.pots = pots;
        res.locals.potStatus = stat;
        
        res.render('home');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;