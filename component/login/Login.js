"use client"
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { CommonButton, CommonInput } from '../common/CommonComponent';
import { useRouter } from 'next/navigation';
import useCustomAxios from "../../utils/UseCustomAxios";
import useAlert from '/utils/useAlert/UseAlert';
import useLoginInfo from "/utils/useLoginInfo/useLoginInfo";
import Image from 'next/image';


const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 30px 0;

`;

const LoginTitle = styled.h2`
  text-align: center;


`;

const ImageContainer = styled.div`
  margin-bottom: 24px;
`

const LoginForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  width: 100%;
`;

const Input = styled(CommonInput)`
  border:1px solid #e5e5e5;
`;

const LoginButton = styled(CommonButton)`
 font-size:16px;
 height: 40px;
 border-radius: 5px;
 margin-top: 24px;
 background-color: #3e504a;
`;

const Login = () => {
  const axios = useCustomAxios();
  const router = useRouter();
  const alertHook = useAlert();
  const [useremail, setuseremail] = useState('');
  const [password, setPassword] = useState('');
  const loginHook = useLoginInfo();


  const login = async () => {
    return await axios({
      method: "POST",
      withCredentials: true,
      data: { USER_EMAIL: useremail, USER_PASSWORD: password },
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/admin`,
    });
  };

  const { refetch: loginRefetch } = useQuery('login', login, {
    enabled: false,
    onSuccess: (res) => {
      const data = res.data;
      if (data.status === "not found") {
        alertHook.alert("아이디가 존재하지 않습니다.", () =>
          router.replace('/login')
        );
      } else if (data.status === "fail" && data.error === "Wrong password") {
        alertHook.alert("비밀번호가 일치하지 않습니다.", () =>
          router.replace('/login')
        );
      } else {
        loginHook.saveLoginInfo(true, 12960000);
        // common.setItemWithExpireTime("loggedIn", true, 12960000);
        router.replace("/");
      }
    },
    onError: (error) => {
      // 로그인 실패 시 에러 처리
      alertHook.alert("로그인에 실패했습니다. 다시 시도해주세요.", () =>
        router.replace('/login')
      );
      console.error('로그인 실패:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginRefetch();
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };


  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>
          <span>어드민</span>
          <ImageContainer>
            <Image width={200} height={110} src="/img/logo_text05.png" alt="루야"></Image>
          </ImageContainer>
        </LoginTitle>

        <Input
          type="email"
          placeholder="이메일"
          value={useremail}
          onChange={(e) => setuseremail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autocomplete="current-password"
          onKeyPress={handlePasswordKeyPress}
        />
        <LoginButton type="submit">로그인</LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
