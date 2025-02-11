import {
  StyledReviewDetailUi,
  StyledTitleAndUbtnAndDbtn,
  StyledReviewTitle,
  StyledUBtn,
  StyledDBtn,
  StyledUserInfo,
  StyledReviewContent,
  StyledBookInfo,
  StyledBtnWrapper,
  StyledReviewBox,
  StyledLogo,
  StyledHomeBtn,
  StyledBookCover,
  StyledTitleInput,
  StyledContentTextarea,
  StyledCustomLoading,
  StyledBookTitle,
  StyledBookAuthor,
  StyledBookTitleAuthor,
  StyledBookGenre,
  StyledInfo,
  StyledPage,
  StyledTitle
} from './ReviewDetailPageStyled.js';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import book from '../../assets/book.jpg';
import { updateReview, deleteReview } from '../../redux/modules/reviewsReducer.js';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.js';
import useFirestore from '../../hooks/useFirestore.js';
import CustomLoading from '../../components/CustomLoading.jsx';
import { getAuth } from 'firebase/auth';

const ReviewDetailPage = () => {
  const { loading } = useFirestore('book-reviews');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //id값 설정
  const { id } = useParams();
  const reviews = useSelector((state) => state.reviewsReducer.reviews); //useSelector로 리뷰데이터 가져오기
  const newReviewDetail = reviews.find((review) => review.id === id) || {}; // 가져온 데이터를 useParams아이디랑 매치시키기

  //상태업데이트
  const [update, setUpdate] = useState(false);
  const [title, setTitle] = useState(newReviewDetail.title || '');
  const [content, setContent] = useState(newReviewDetail.content || '');

  //작성자 아이디와 현재 아이디 비교하기위한 코드
  const reviewAuthorId = newReviewDetail.author;
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      // 현재 로그인한 사용자의 UID
      setCurrentUserId(user.uid);
    }
  }, []);

  //newReviewDetail.createdAt을 호출하기위한 코드
  let reviewDate = '';
  if (newReviewDetail.createdAt && newReviewDetail.createdAt.toDate) {
    // createdAt이 정의되어 있고 toDate 메서드를 가지고 있는 경우에만 toDate 호출
    const date = newReviewDetail.createdAt.toDate();
    reviewDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시`;
  }

  //수정상태로 전환,롤백
  const editHandler = () => setUpdate(true);
  const rollbackHandler = () => setUpdate(false);
  //fire base 업데이트로직
  const saveHandler = async () => {
    const reviewRef = doc(db, 'book-reviews', id); //db는 초기화된 Firestore 인스턴스, 'book-reviews'는 컬렉션의 이름, id는 ReviewDetailPage의 ID.
    await updateDoc(reviewRef, { title, content });
    dispatch(updateReview(id, { title, content }));
    setUpdate(false);
    navigate(`/review-detail/${id}`);
  };
  //fire base 삭제로직
  const deleteHandler = async () => {
    if (window.confirm('이 리뷰를 삭제하시겠습니까?')) {
      const reviewRef = doc(db, 'book-reviews', id);
      await deleteDoc(reviewRef);
      dispatch(deleteReview(id));
      navigate('/review');
    }
  };
  console.log(newReviewDetail.createdAt);
  //로딩실행 , redux persist도 있다 찾아보기
  useEffect(() => {
    if (loading) {
      console.log('loading...');
    } else {
      console.log('done');
    }
  }, [loading]);

  return (
    //삼항연산자 이용, update의 초기값을 false로 놓고 false면 리뷰구현 true면 수정부분구현
    <StyledPage>
      {' '}
      {!loading &&
        (update ? (
          <>
            <>
              <StyledReviewDetailUi>
                <StyledReviewBox>
                  <StyledTitleAndUbtnAndDbtn>
                    <StyledTitleInput
                      maxLength={20}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    ></StyledTitleInput>
                    <StyledBtnWrapper>
                      <StyledUBtn text="저장" color="main" onClick={saveHandler} />
                      <StyledDBtn text="취소" color="red" onClick={rollbackHandler} />
                    </StyledBtnWrapper>
                  </StyledTitleAndUbtnAndDbtn>
                  <StyledUserInfo>
                    <StyledLogo>
                      <img src={newReviewDetail.authorProfile} alt="Profile" />
                    </StyledLogo>
                    <StyledTitle>{newReviewDetail.authorName}</StyledTitle>
                    <StyledInfo>{reviewDate}</StyledInfo>
                  </StyledUserInfo>
                  <StyledContentTextarea
                    maxLength={200}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></StyledContentTextarea>
                  <StyledBookInfo>
                    <StyledBookCover>
                      <img src={newReviewDetail.image || book} alt="Book Cover" />
                    </StyledBookCover>
                    <StyledBookTitleAuthor>
                      <StyledBookTitle>{newReviewDetail.bookTitle}</StyledBookTitle>
                      <StyledBookAuthor>{newReviewDetail.bookAuthor} 지음</StyledBookAuthor>
                      <StyledBookGenre> 장 르 : {newReviewDetail.genre}</StyledBookGenre>
                    </StyledBookTitleAuthor>
                  </StyledBookInfo>
                </StyledReviewBox>
                <StyledHomeBtn
                  text="뒤로가기"
                  color="white"
                  onClick={() => {
                    navigate(`/review`);
                  }}
                ></StyledHomeBtn>
              </StyledReviewDetailUi>
            </>
          </>
        ) : (
          <>
            <StyledReviewDetailUi>
              <StyledReviewBox>
                <StyledTitleAndUbtnAndDbtn>
                  <StyledReviewTitle>{newReviewDetail.title}</StyledReviewTitle>
                  {reviewAuthorId === currentUserId && (
                    <StyledBtnWrapper>
                      <StyledUBtn text="수정" color="main" onClick={editHandler} />
                      <StyledDBtn text="삭제" color="white" onClick={deleteHandler} />
                    </StyledBtnWrapper>
                  )}
                </StyledTitleAndUbtnAndDbtn>
                <StyledUserInfo>
                  <StyledLogo>
                    <img src={newReviewDetail.authorProfile} alt="Profile" />
                  </StyledLogo>
                  <StyledTitle>{newReviewDetail.authorName}</StyledTitle>
                  <StyledInfo>{reviewDate}</StyledInfo>
                </StyledUserInfo>
                <StyledReviewContent>{newReviewDetail.content}</StyledReviewContent>
                <StyledBookInfo>
                  <StyledBookCover>
                    <img src={newReviewDetail.image || book} alt="Book Cover" />
                  </StyledBookCover>
                  <StyledBookTitleAuthor>
                    <StyledBookTitle>{newReviewDetail.bookTitle}</StyledBookTitle>
                    <StyledBookAuthor>{newReviewDetail.bookAuthor} 지음</StyledBookAuthor>
                    <StyledBookGenre> 장 르 : {newReviewDetail.genre}</StyledBookGenre>
                  </StyledBookTitleAuthor>
                </StyledBookInfo>
              </StyledReviewBox>
              <StyledHomeBtn
                text="뒤로가기"
                color="white"
                onClick={() => {
                  navigate(`/review`);
                }}
              ></StyledHomeBtn>
            </StyledReviewDetailUi>
          </>
        ))}
      {loading && (
        <StyledCustomLoading>
          <CustomLoading />
        </StyledCustomLoading>
      )}
    </StyledPage>
  );
};

export default ReviewDetailPage;
