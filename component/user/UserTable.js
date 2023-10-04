"use client"
import styled from "styled-components"
import { THead, TBody } from "../common/CommonComponent"
import { useMutation, useQuery } from "react-query"
import { useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { paginationState } from "../../state/pagination";
import useCustomAxios from "../../utils/UseCustomAxios"
import CommonPagination from "../common/CommonPagination"

const UserTableWapper = styled.div`
`
const UserTableContainer = styled.div`
  width: 90%;
  border-radius: 20px;
  padding: 20px 30px;
  min-height:200px;
  margin: 100px auto 0;
`
const TableOfUser = styled.table`
  width: 100%;
  border-collapse:separate;
  border-spacing:0 24px;
  background-color: #fefefe;
  box-shadow: 0 3px 5px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 10px 20px;
`


const UserTableTHead = styled(THead)`
  
  `
const UserTableTBody = styled(TBody)`
`
const UserTitle = styled.h2`
  padding: 50px 0;
`

function UserTable() {
  const [userList, setUserList] = useState(null);
  const paginationStateInfo = useRecoilValue(paginationState("userTable"));
  const setPaginationState = useSetRecoilState(paginationState("userTable"));

  const axios = useCustomAxios();

  const getTotalCount = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/totalcountlist`,
    });
  };

  useQuery('getTotalUserCount', getTotalCount, {
    onSuccess: (res) => {
      const data = res.data;
      if (data.status === "success") {
        setPaginationState(prev => {
          return {
            ...prev,
            totalItems: data.totalItems
          }
        })
      }
    },
    onError: (error) => {
      console.error('에러:', error);
    },
  });


  const getUserList = async () => {
    return await axios({
      method: "GET",
      params: paginationStateInfo,
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/user/list`,
    });
  };

  const { refetch: getUserListRefetch } = useQuery(['getUserList', paginationStateInfo], getUserList, {
    onSuccess: (res) => {
      const data = res.data;
      if (data.status === "success") {
        setUserList(data.userList);
      }
    },
    onError: (error) => {
      console.error('에러:', error);
    },
  });

  const handlePageChange = (pageNumber) => {
    setPaginationState(prev => {
      return {
        ...prev,
        pageNumber: pageNumber,
        itemsPerPage: prev.itemsPerPage,
      }
    })
  }


  return (
    <UserTableWapper>
      <UserTableContainer>
        <TableOfUser>
          <UserTableTHead>
            <tr>
              <th>No.</th>
              <th>이름</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>성별</th>
              <th>가입유형</th>
              <th>가입일</th>
            </tr>
          </UserTableTHead>
          <UserTableTBody>
            {userList && userList.length !== 0 &&
              userList.map((user, index) => {
                return (
                  <tr key={user.USER_NO}>
                    <td>{(paginationStateInfo.pageNumber - 1) * paginationStateInfo.itemsPerPage + index + 1}</td>
                    <td>{user.USER_NAME}</td>
                    <td>{user.USER_EMAIL}</td>
                    <td>{user.USER_PHONE}</td>
                    <td>{user.USER_GENDER}</td>
                    <td>{user.USER_TYPE}</td>
                    <td>{user.CREATED_DT.split(" ")[0]}</td>
                  </tr>
                )
              })
            }
          </UserTableTBody>
        </TableOfUser>
        {paginationStateInfo && paginationStateInfo.totalItems &&
          <CommonPagination
            activePage={paginationStateInfo.pageNumber}
            itemsPerPage={paginationStateInfo.itemsPerPage}
            totalItems={paginationStateInfo.totalItems}
            handlePageChange={handlePageChange}
          ></CommonPagination>
        }
      </UserTableContainer>
    </UserTableWapper >
  );
}

export default UserTable;
