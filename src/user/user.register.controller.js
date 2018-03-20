require('dotenv').config();

const express = require('express');
const query = require('../Query');
const ms = require('../message');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

exports.signUp = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json('이메일을 입력해주세요')
  } else if (!req.body.password) {
    return res.status(400).json('비밀번호를 입력해주세요')
  } else if (!req.body.username) {
    return res.status(400).json('유저을 입력해주세요')
  }
  // 이메일이 하나만 있는지 확인하는 부분
  // 여기서 먼저 유저를 확인하고 있으면 에러띠우고 없으면 다음으로 넘어가게 만들어야 끝나지!!!!!!!!!!!
  // 자바스크립트 순서가 매우 중요해ㅑ!!!!!!!!!
  const checkEmail = await User.findOne({ email: req.body.email });
  const checkUsername = await User.findOne({ username: req.body.username });
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
  const createUser = await User.create(userInfo);
  if (createUser) {
    console.log('success')
    return res.status(200).json('성공')
  }
};

exports.edit = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json('email이 맞지 않습니다.')
  } else if (!req.body.password) {
    return res.status(400).json('password가 맞지 않습니다.')
  } else if (!req.body.username) {
    return res.status(400).json('username이 맞지 않습니다.')
  }
  const userInfo = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    username: req.body.username
  };
  // 이메일이 하나만 있는지 확인하는 부분
  const checkEmail = await User.findOne({ email: userInfo.email });
  const checkUsername = await User.findOne({ username: userInfo.username });  
  if (checkEmail === null) {
    if(checkUsername) {
      res.status(400).json('닉네임이 이미 존재합니다.')
    }
    return res.status(200).json('아이디가 없습니다. \'id\' or \'password\'를 체크해주세요')
  }

  // 확인이 완료된 userInfo를 데이터베이스에 생성하는 부분
  const updateUser = await User.update({
    email: userInfo.email
  }, {
      password: userInfo.password,
      username: userInfo.username
    })
  if (updateUser) {
    return res.status(200).json('성공')
  }
}