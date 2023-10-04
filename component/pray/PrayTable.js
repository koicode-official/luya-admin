"use client"
import styled from "styled-components"
import { THead, TBody } from "../common/CommonComponent"
import { useMutation, useQuery } from "react-query"
import { useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { paginationState } from "../../state/pagination";
import useCustomAxios from "../../utils/UseCustomAxios"
import CommonPagination from "../common/CommonPagination"

const PrayTableWapper = styled.div`
`
const PrayTableContainer = styled.div`
  width: 90%;
  border-radius: 20px;
  padding: 20px 30px;
  min-height:200px;
  margin: 100px auto 0;
`
const TableOfPray = styled.table`
  width: 100%;
  border-collapse:separate;
  border-spacing:0 24px;
  background-color: #fefefe;
  box-shadow: 0 3px 5px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 20px;
`


const PrayTableTHead = styled(THead)``
const PrayTableTBody = styled(TBody)`
  font-size: 14px;
`

function PrayTable() {
  const [prayList, setPrayList] = useState(null);
  const paginationStateInfo = useRecoilValue(paginationState("prayTable"));
  const setPaginationState = useSetRecoilState(paginationState("prayTable"));
  const axios = useCustomAxios();


  const getTotalCount = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/totalcountpray`,
    });
  };

  useQuery('getTotalCount', getTotalCount, {
    onSuccess: (res) => {
      const data = res.data;
      console.log('data', data)
      if (data.message === "success") {
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



  const getPrayList = async () => {
    return await axios({
      method: "GET",
      params: paginationStateInfo,
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/pray/listall`,
    });

  };

  useQuery(['getPrayList',paginationStateInfo], getPrayList, {
    onSuccess: (res) => {
      const data = res.data;
      if (data.message === "success") {
        setPrayList(data.prayList);
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
    <PrayTableWapper>
      <PrayTableContainer>
        <TableOfPray>
          <PrayTableTHead>
            <tr>
              <th>No.</th>
              <th>기도제목</th>
              <th>생성일</th>
              <th>수정일</th>
            </tr>
          </PrayTableTHead>
          <PrayTableTBody>
            {prayList && prayList.length !== 0 &&
              prayList.map((pray, index) => {
                return (
                  <tr key={pray.PRAY_NO}>
                    <td>{(paginationStateInfo.pageNumber - 1) * paginationStateInfo.itemsPerPage + index + 1}</td>
                    <td>{pray.PRAY_TEXT}</td>
                    <td>{pray.CREATED_AT.split(" ")[0]}</td>
                    <td>{pray.UPDATED_AT.split(" ")[0]}</td>
                  </tr>
                )
              })
            }
          </PrayTableTBody>
        </TableOfPray>
        {paginationStateInfo && paginationStateInfo.totalItems &&
          <CommonPagination
            activePage={paginationStateInfo.pageNumber}
            itemsPerPage={paginationStateInfo.itemsPerPage}
            totalItems={paginationStateInfo.totalItems}
            handlePageChange={handlePageChange}
          ></CommonPagination>
        }
      </PrayTableContainer>
    </PrayTableWapper>
  );
}

export default PrayTable;
