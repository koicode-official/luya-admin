"use client"

import styled from "styled-components"
import CommonMenu from "./CommonMenu";
import CommonAlert from "./CommonAlert";
import CommonConfirm from "./CommonConfirm";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from 'react-query';
import useCustomAxios from "../../utils/UseCustomAxios";
import useLoginInfo from "/utils/useLoginInfo/useLoginInfo";
import useAlert from "/utils/useAlert/UseAlert";
import useConfirm from "/utils/useConfirm/UseConfirm";

const CommonLayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const Contents = styled.div`
  position: relative;
  width: 85%;
  /* background-color: #F8F9FA; */
`
const LoginInfo = styled.div`
  position: fixed;
  right:0;
  top:0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: auto;
  width:100%;
  background-color: #3e504a;
  color:#fefefe;
  padding: 10px 20px;
`

const LogOut = styled.button`
  border:1px solid #e5e5e5;
  background-color: #fefefe;
  color:#777777;
  margin-left: 16px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  
`


function CommonLayout({ children }) {
  const pathName = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState();
  const axios = useCustomAxios();
  const loginHook = useLoginInfo();

  const { alertStateInfo, alert } = useAlert();
  const { confirmStateInfo } = useConfirm();

  const getUserInfo = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/info`,
    });
  };

  const { refetch: getUserInfoRefetch } = useQuery('getUserInfo', getUserInfo, {
    onSuccess: (res) => {
      const data = res.data;
      if (data.status === "success") {
        setUserInfo(data.userEmail);
      }
    },
    onError: (error) => {
      // 로그인 실패 시 에러 처리
      alert.alert("로그인에 실패했습니다. 다시 시도해주세요.", () =>
        router.replace('/login')
      );
      console.error('로그인 실패:', error);
    },
  });



  const logOut = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/login/logout`,
    })
  }

  const { refetch: logOutRefetch } = useQuery("logOut", logOut, {
    enabled: false,
    onSuccess: response => {
      if (response.data.status === "success") {
        loginHook.saveLoginInfo(false, 0);
        document.cookie = "_actk" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "_rftk" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        router.push("/");
      }
    },
    onError: error => {
      console.log("Error Occured : ", error);
    }
  });

  useEffect(() => {
    if (pathName === "/admin/login") {
      getUserInfoRefetch();
    }
  }, [])



  return (
    <CommonLayoutWrapper>
      {alertStateInfo.active === true &&
        <CommonAlert></CommonAlert>
      }
      {confirmStateInfo.active === true &&
        <CommonConfirm></CommonConfirm>
      }

      {pathName && pathName === "/admin/login" ? (
        <>{children}</>
      ) : (
        <>
          <CommonMenu></CommonMenu>
          <Contents>
            <LoginInfo>
              {userInfo && <p>{userInfo}</p>}
              <LogOut onClick={() => logOutRefetch()}>로그아웃</LogOut>
            </LoginInfo>
            {children}
          </Contents>
        </>
      )}

      {/* {pathName && pathName !== "/login" ?
        <>
          <CommonMenu></CommonMenu>
          <Contents>
            <LoginInfo>
              {userInfo &&
                <p>{userInfo}</p>
              }
              <LogOut onClick={() => logOutRefetch()}>로그아웃</LogOut>
            </LoginInfo>
            {children}
          </Contents>
        </>
        :
        <>
          {children}
        </>
      } */}
    </CommonLayoutWrapper >
  );
}

export default CommonLayout;