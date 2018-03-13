# Project
## 프로젝트 목표
1. Passport를 사용하여 로컬 로그인
2. 게시판 리스트 출력가능(카드형, 리스트형)
3. 게시글 게시하기
4. 게시글 수정하기
5. 게시글 삭제하기

## Spec
1. MongoDB
2. Node.js
3. ejs

## API 목록

| Route | Methood | Description |  
|---|---|---| 
| /user/login | GET | 로그인 창 |
| /user/register | POST | 회원가입 창 |
| /article/lists | GET | 메인페이지 |
| /article/new | POST | 게시글 데이터 생성 |
| /article/lists/:list_id | GET | 게시글 보기 |
| /article/lists/:uid | GET | 게시글 데이터 user의 id값으로 조회 |
| /article/lists/edit | get | 게시글 데이터 수정할 페이지 |
| /article/lists/:list_id | PUT | 게시글 데이터 수정 |
| /article/lists/:list_id | DELETE | 게시글 데이터 삭제 |
