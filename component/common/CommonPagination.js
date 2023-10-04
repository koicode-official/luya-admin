"use client"

import styled from "styled-components"
import ReactPaginate from 'react-js-pagination';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  ul{
    display: flex;
    justify-content: space-between;
    width: fit-content;
  li{
    padding: 5px 10px;
    border-radius: 2px;
    background-color: #fefefe;
    cursor: pointer;

    a{
      box-sizing: border-box;
      color:#232323;
      text-decoration:none;
    }
    &.active {
      background-color: #3e504a;
      a{
      color: #fefefe;
      }
    }
  }
  }
`



function CommonPagination({ activePage = 1, itemsPerPage, totalItems, handlePageChange }) {

  return (
    <PaginationContainer>
      <ReactPaginate
        activePage={activePage}
        itemsCountPerPage={itemsPerPage} // 한 페이지당 아이템 수
        totalItemsCount={totalItems}     // 전체 아이템 수
        pageRangeDisplayed={5}           // 표시할 페이지 수
        prevPageText={"이전"}
        nextPageText={"다음"}
        onChange={handlePageChange}      // 페이지 변경 시 호출되는 콜백 함수
      />
    </PaginationContainer>
  );
}

export default CommonPagination;