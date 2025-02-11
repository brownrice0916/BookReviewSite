import { useEffect } from 'react';
import CustomLoading from '../../../components/CustomLoading';
import { auth } from '../../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const KakaoSignInPage = () => {
  const code = new URL(window.location.href).searchParams.get('code');
  const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_SIGNIN_REDIRECT_URI;
  const BASE_URL = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${code}`;
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  };
  const navigate = useNavigate();
  const getToken = async (code) => {
    try {
      const response = await fetch(BASE_URL, option);
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const kakaoSignIn = async () => {
      try {
        if (code) {
          const { access_token } = await getToken(code);
          console.log(access_token);
          const {
            data: {
              kakao_account: { email }
            }
          } = await axios.post(
            'https://kapi.kakao.com/v2/user/me',
            {},
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
          const signinRes = await signInWithEmailAndPassword(auth, email, 'password');
          console.log('로그인 성공', signinRes);
          navigate('/');
        }
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    };

    kakaoSignIn();
  }, []);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CustomLoading />
    </div>
  );
};

export default KakaoSignInPage;
