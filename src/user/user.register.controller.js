require('dotenv').config();

const express = require('express');
const query = require('../Query');
const ms = require('../message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

exports.signUp = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json('이메일을 입력해주세요')
  } else if (!req.body.password) {
    return res.status(400).json('비밀번호를 입력해주세요')
  } else if (!req.body.password2) {
    return res.status(400).json('확인 비밀번호를 입력해주세요')
  } else if (!req.body.username) {
    return res.status(400).json('유저을 입력해주세요')
  } else if ( req.body.password !== req.body.password2 ) {
    return res.status(400).json('비밀번호와 확인 비밀번호를 똑같이 입력해주세요.')
  }

  const checkEmail = await query.checkIdExist(req.body.email);
  const checkUsername = await query.checkUsernameExist(req.body.username);
  if (checkEmail || checkUsername) {
    return res.status(400).json('아이디 또는 닉네임이 이미 존재합니다.')
  } 
  
  // 입력한 정보를 userInfo에 저장하는 부분
  const userInfo = {
    email: req.body.email,
    // bcrypt를 사용하여 hash로 들어오는 비밀번호 변환
    password: bcrypt.hashSync(req.body.password, 10),
    username: req.body.username
  };
  const createUser = await query.createUser(userInfo);
  if (createUser) {
    console.log('success')
    return res.status(200).redirect('/user/login');
  }
};

exports.edit = async (req, res) => {
  // 1. 로그인이 되어있는 정보 가져오기
  const token = req.cookies.auth;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await query.checkUserBy_id(decoded.id);
  const Password = user.password;
  const checkPassword = req.body.checkPassword;
  // 2. 로그인이 되어있는 유저의 비밀번호와 입력한 비번이 일치하는지 확인
  const check = (user && bcrypt.compareSync(checkPassword, Password)) ? (null, user) : (null, false);
  // 3. 확인이 되면 유저 정보를 수정
  if (!check) {
    console.log('password오류')
    return res.status(400).json('확인 비밀번호가 맞지않습니다.')
  } else {
    // 4. 수정한 정보를 데이터베이스에 저장
    const userInfo = {
      email: user.email,
      password: bcrypt.hashSync(req.body.newPassword, 10),
      username: req.body.newUsername
    };

    // 이메일이 하나만 있는지 확인하는 부분
    const checkUsername = await query.checkUsernameExist(userInfo.username);
    if (checkUsername !== null) {
      return res.status(400).json('닉네임이 이미 존재합니다.')
    }
    const updateUser = await query.updatePasswordAndUsername(user._id, userInfo)
    if (updateUser) {
      return res.status(200).redirect('/article/lists')
    }
    return res.status(400).json('수정되지 않았습니다.');
  } 
}