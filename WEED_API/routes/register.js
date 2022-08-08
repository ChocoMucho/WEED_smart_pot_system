const express = require('express');
const bcrypt = require('bcrypt'); //암호 해싱을 위해 bcypt 모듈을 가져와서 사용
const User = require('../models/user'); //models 폴더의 user 모듈을 가져와서 사용

const router = express.Router(); //라우터 분리를 위해 사용

router.route('/') // 기본 경로
.get(async (req, res, next) => {
    try {
        //User table에서 모든 사용자의 id속성을 가져온다.
        const users = await User.findAll({
            attributes: ['id']
        });

        res.locals.title = require('../package.json').name; //package.json의 name 속성을 가져와 html파일에서 사용할 수 있도록 title 변수에 할당
        res.locals.port = process.env.PORT; //env의 PORT 속성을 port에 할당해 html에서 변수로 사용하도록 함
        res.locals.users = users.map(v => v.id); //사용자의 id를 리스트로 리턴해 users 변수에 할당해 html파일에서 변수로 사용하도록 함
        res.render('register'); //user.html을 읽어서 응답. configure함수 호출
    } catch (err) {
        console.error(err);
        next(err);
    }
})
.post(async (req, res, next) => {
    const { id, password, name } = req.body;

    //password가 입력되지 않은 경우 해당 메시지를 출력 후 넘긴다.
    if (!password) return next('비밀번호를 입력하세요.');

    const user = await User.findOne({ where: { id } }); //User table에서 id로 찾아온다.
    if (user) { //테이블 내에 존재하는 id일 경우
        next('이미 등록된 사용자 아이디입니다.');
        return;
    }

    try {
        const hash = await bcrypt.hash(password, 12); //password를 12번 해싱함
        await User.create({ // User테이블에 새로운 값을 추가한다.
            id,
            password: hash, // password는 암호화된 비밀번호를 할당
            name
        });

        //위 작업이 끝나면 기본 경로로 redirect
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router; //이 모듈을 외부로 노출시켜 사용 가능하도록 함