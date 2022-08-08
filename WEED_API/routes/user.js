const express = require('express');
const bcrypt = require('bcrypt'); //암호 해싱을 위해 bcypt 모듈을 가져와서 사용
const User = require('../models/user'); //models 폴더의 user 모듈을 가져와서 사용
const { isLoggedIn } = require('./helpers');

const router = express.Router(); //라우터 분리를 위해 사용

router.route('/') // 기본 경로
    .get(async (req, res, next) => {
        try {
            res.locals.title = require('../package.json').name; //package.json의 name 속성을 가져와 html파일에서 사용할 수 있도록 title 변수에 할당
            res.locals.port = process.env.PORT; //env의 PORT 속성을 port에 할당해 html에서 변수로 사용하도록 함
            res.locals.user = req.user;
            
            res.render('user'); //user.html을 읽어서 응답. configure함수 호출
            console.log(req.user);
           
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

router.post('/update', async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const result = await User.update({
            password: hash,
            name: req.body.name
        }, {
            where: { id: req.user.id }
        });

        if (result) res.redirect('/'); //결과값이 true이면 redirect
        else next('Not updated!') //false일 경우 에러로 넘김
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        //User 테이블 내의  id가 넘겨받은 id와 동일한 경우 삭제하고 그 결과값을 result에 담음
        const result = await User.destroy({
            where: { id: req.params.id }
        });

        if (result) res.redirect('/');
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router; //이 모듈을 외부로 노출시켜 사용 가능하도록 함