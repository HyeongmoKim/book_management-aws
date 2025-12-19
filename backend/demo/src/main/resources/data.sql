-----------------------------------------
-- 1) USERS 더미 데이터
-----------------------------------------
INSERT INTO USERS (EMAIL, NAME, PASSWORD, ROLE)
VALUES ('test@test.com', 'tester', '1234', 'ADMIN');

INSERT INTO USERS (EMAIL, NAME, PASSWORD, ROLE)
VALUES ('user2@test.com', 'tester2', '1234', 'USER');

-----------------------------------------
-- 2) BOOK 더미 데이터
-----------------------------------------
INSERT INTO BOOK (
    BOOK_CONTENT,
    BOOK_IMAGE_URL,
    CREATED_AT,
    BOOK_RECOMMEND,
    BOOK_TITLE,
    UPDATED_AT,
    USERS_USER_ID
) VALUES (
    '책 설명',
    'http://test.com/cover.jpg',
    CURRENT_TIMESTAMP(),
    0,
    '테스트 책',
    CURRENT_TIMESTAMP(),
    1
);

INSERT INTO BOOK (
    BOOK_CONTENT,
    BOOK_IMAGE_URL,
    CREATED_AT,
    BOOK_RECOMMEND,
    BOOK_TITLE,
    UPDATED_AT,
    USERS_USER_ID
) VALUES (
    '두번째 책 설명',
    'http://test.com/cover2.jpg',
    CURRENT_TIMESTAMP(),
    0,
    '두번째 테스트 책',
    CURRENT_TIMESTAMP(),
    2
);

-----------------------------------------
-- 3) COMMENT 더미 데이터
-----------------------------------------
INSERT INTO COMMENT (
    COMMENT_ACTIVE,
    COMMENT_CONTENT,
    COMMENT_DATE,
    COMMENT_RECOMMEND,
    COMMENT_TITLE,
    BOOK_BOOK_ID,
    USERS_USER_ID
) VALUES (
    TRUE,
    '첫 번째 댓글입니다!',
    CURRENT_TIMESTAMP(),
    0,
    '댓글1 제목',
    1,
    1
);

INSERT INTO COMMENT (
    COMMENT_ACTIVE,
    COMMENT_CONTENT,
    COMMENT_DATE,
    COMMENT_RECOMMEND,
    COMMENT_TITLE,
    BOOK_BOOK_ID,
    USERS_USER_ID
) VALUES (
    TRUE,
    '두 번째 댓글입니다!',
    CURRENT_TIMESTAMP(),
    0,
    '댓글2 제목',
    1,
    1
);

-----------------------------------------
-- 4) BOOK_RECOMMEND 더미 데이터
--    테이블 구조: BOOK_RECOMMEND_ID, BOOK_BOOK_ID, USERS_USER_ID
-----------------------------------------
INSERT INTO BOOK_RECOMMEND (BOOK_BOOK_ID, USERS_USER_ID)
VALUES (1, 1);

INSERT INTO BOOK_RECOMMEND (BOOK_BOOK_ID, USERS_USER_ID)
VALUES (1, 2);

-----------------------------------------
-- 5) COMMENT_RECOMMEND 더미 데이터
--    테이블 구조: COMMENT_RECOMMEND_ID, COMMENT_COMMENT_ID, USERS_USER_ID
-----------------------------------------
INSERT INTO COMMENT_RECOMMEND (COMMENT_COMMENT_ID, USERS_USER_ID)
VALUES (1, 1);

INSERT INTO COMMENT_RECOMMEND (COMMENT_COMMENT_ID, USERS_USER_ID)
VALUES (2, 2);
