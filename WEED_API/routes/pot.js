const express = require('express');
const {User, Pot, PotStatus} = require('../models');
const {isLoggedIn} = require('./helpers');
const router = express.Router();

//화분 등록/regist, 화분 설정 값 변경 라우터/set


//기능은 완성

router.route('/')
    .get(isLoggedIn, async (req, res, next) => {
        try {
            console.log("SUC");
            res.render('potRegister');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

//화분 등록에 넘어올 정보는
//받아오는 정보는 유저 아이디, (화분아이디, 화분이름, 식물 이름) 이렇게 4개
//설정 온도, 설정 습도 기본 값은 리퀘스트로 받지 않고 20도 25퍼센트로 라우터에서 넣는다. 
router.post('/regist', isLoggedIn, async (req, res, next) => {
        try {
            const {potId, name, plant} = req.body;
            const setTem = 20;
            const setHum = 25;
            const userId = req.user.id;
            //똑같은 아이디 화분이 있을 경우 페이지를 돌린다거나
            //파이 쪽에서 화분 등록을 먼저 해놓고 여기서는 연결하는 방식으로 바꾸든가..
            await Pot.create({id: potId, name, plant, setTem, setHum, userId});

            res.redirect('/home');//왜 render는 안되는걸까
        } catch (err) {
            console.error(err);
            next(err);
        }
});

//화분 온습도 값 세팅 변경, 라우터로 넘어올 정보는 화분아이디, 설정 온도, 설정 습도
router.route('/set/:potId')
.get(isLoggedIn, async (req, res, next) => {
    try {
        const potId = req.params.potId;
        const pot = await Pot.findOne({//화분 정보
            where: {
                id: potId
            },
            raw: true
        });
        
        res.locals.pot = pot;

        res.render('potSet');//화분 정보 변경하는 페이지 로드
    } catch (err) {
        console.error(err);
        next(err);
    }
})
.post(isLoggedIn, async (req, res, next) => {
    try {
        const potId = req.params.potId;
        const {setTem, setHum} = req.body;
        const result = await Pot.update({
            setTem,
            setHum
        }, {
            where: {
                id: potId
            }
        });

        if (!result) 
        //실패하면 다시 화분 정보 업데이트 화면으로
            res.redirect(`http://localhost:3000/pot/update/${potId}`);
        //성공하면 화분 디테일 화면으로
        res.redirect(`http://localhost:3000/pot/detail/${potId}`);
        
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//화분 텍스트 정보 변경, 라우터로 넘어 올 정보는 화분 아이디, 화분 이름, 식물 이름
router.route('/update/:potId')
.get(isLoggedIn, async (req, res, next) => {
    try {
        const potId = req.params.potId;
        const pot = await Pot.findOne({//화분 텍스트 정보들
            where: {
                id: potId
            },
            raw: true
        });
        
        res.locals.pot = pot;

        res.render('potUpdate');//화분 정보 변경하는 페이지 로드
    } catch (err) {
        console.error(err);
        next(err);
    }
})
.post(isLoggedIn, async (req, res, next) => {
    try {
        const potId = req.params.potId;
        const {name, plant} = req.body;
        console.log(name, plant);
        const result = await Pot.update({
            name,
            plant
        }, {
            where: {
                id: potId
            }
        })

        if (!result) 
        //실패하면 다시 화분 정보 업데이트 화면으로
            res.redirect(`http://localhost:3000/pot/update/${potId}`);
        //성공하면 화분 디테일 화면으로
        res.redirect(`http://localhost:3000/pot/detail/${potId}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//화분의 자세한 정보 제공
//메인화면에 화분들 중에 하나 클릭 시
router.get('/detail/:potId', isLoggedIn, async (req, res, next) => {
    //우선 디테일 정보 보여줄 html페이지 필요함
    
    try {
        //1.아이디를 받는다
        const potId = req.params.potId;

        const pot = await Pot.findOne({//화분 텍스트 정보들
            where: {
                id: potId
            },
            raw: true
        });

        //2.아이디로 pot테이블의 값, potStatus의 인덱스가 가장 높은 온습도 값을 가져온다.
        const index = await PotStatus.max('id', {//위에서 받아온 화분 아이디로 potStatus 제일 큰 인덱스 가져오기
            where: {
                potId
            },
            raw: true
        });

        const status = await PotStatus.findOne({//해당 인덱스로 potStatus 행 가져오기
            where: { id: index },
            raw: true
        });
        
        //3.페이지에 렌더링 해준다. 
        res.locals.pot = pot;
        res.locals.status = status;

        res.render('potDetail');

    } catch (err) {
        console.error(err);
        next(err);
    }

    

    
    //3.페이지에 렌더링 해준다. 
    
});

router.get('/delete/:potId', async (req, res, next) => {
    try {
        const result = await Pot.destroy({
            where: { id: req.params.potId }
        });

        if (result) res.redirect('/home');
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;