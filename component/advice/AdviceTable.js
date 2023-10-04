"use client"
import styled from "styled-components";
import { THead, TBody } from "../common/CommonComponent";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { paginationState } from "../../state/pagination";
import useCustomAxios from "../../utils/UseCustomAxios";
import CommonPagination from "../common/CommonPagination"


const AdviceTableWapper = styled.div``;

const AdviceTableContainer = styled.div`
  width: 90%;
  border-radius: 20px;
  padding: 20px 30px;
  min-height: 200px;
  margin: 100px auto 0;
`;

const TableOfAdvice = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 24px;
  background-color: #fefefe;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
`;

const AdviceTableTHead = styled(THead)``;
const AdviceTableTBody = styled(TBody)`
  font-size: 14px;
  line-height: 17px;
`;

const AdviceButton = styled.button`
  border: 1px solid #e5e5e5;
  background-color: #fefefe;
  color: #777777;
  margin-left: 16px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
`;
const CloseButton = styled(AdviceButton)`
  float: right;
`

const PopupBackground = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  z-index: 999;
`;

const Popup = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 80%;
  max-width: 800px;
  padding: 20px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* 팝업은 배경 위에 표시되어야 합니다. */
  font-size: 16px;
  line-height: 26px;
  p{
    word-break: break-all;
  }
  h2{
    color:#3e504a;
    margin-bottom: 24px;
    font-size: 18px;
  }
`;

function AdviceTable() {
  const [adviceList, setAdviceList] = useState(null);
  const [showFullTextArray, setShowFullTextArray] = useState([]);
  const [selectedAdvice, setSelectedAdvice] = useState(null); // 선택된 글을 저장할 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 창 열림/닫힘 상태
  const paginationStateInfo = useRecoilValue(paginationState("adviceTable"));
  const setPaginationState = useSetRecoilState(paginationState("adviceTable"));
  const axios = useCustomAxios();

  const getTotalCount = async () => {
    return await axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/advice/totalcountadvice`,
    });
  };

  useQuery('getTotalAdviceCount', getTotalCount, {
    onSuccess: (res) => {
      const data = res.data;
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



  const getAdviceList = async () => {
    return await axios({
      method: "GET",
      params: paginationStateInfo,
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/advice/listall`,
    });
  };

  useQuery(["getAdviceList",paginationStateInfo], getAdviceList, {
    onSuccess: (res) => {
      const data = res.data;
      if (data.message === "success") {
        setAdviceList(data.adviceList);
        setShowFullTextArray(new Array(data.adviceList.length).fill(false));
      }
    },
    onError: (error) => {
      console.error("에러:", error);
    },
  });

  // 특정 행의 "더 보기" 버튼 클릭 시 해당 행의 내용 토글
  const toggleText = (index) => {
    const newShowFullTextArray = [...showFullTextArray];
    newShowFullTextArray[index] = !newShowFullTextArray[index];
    setShowFullTextArray(newShowFullTextArray);
  };

  // 팝업 열기
  const openPopup = (advice) => {
    setSelectedAdvice(advice);
    setIsPopupOpen(true);
  };

  // 팝업 닫기
  const closePopup = () => {
    setSelectedAdvice(null);
    setIsPopupOpen(false);
  };

  // 배경 클릭 시 팝업 닫기
  const handleBackgroundClick = () => {
    closePopup();
  };

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
    <AdviceTableWapper>
      <AdviceTableContainer>
        <TableOfAdvice>
          <AdviceTableTHead>
            <tr>
              <th>No.</th>
              <th>질문/고민</th>
              <th>답변</th>
              <th>유형</th>
              <th>등록일</th>
            </tr>
          </AdviceTableTHead>
          <AdviceTableTBody>
            {adviceList &&
              adviceList.length !== 0 &&
              adviceList.map((advice, index) => {
                return (
                  <tr key={advice.ADVICE_NO}>
                    <td>{(paginationStateInfo.pageNumber - 1) * paginationStateInfo.itemsPerPage + index + 1}</td>
                    <td>{advice.QUESTION}</td>
                    <td>
                      {showFullTextArray[index] ? (
                        advice.ADVICE_TXT
                      ) : (
                        `${advice.ADVICE_TXT.substr(0, 40)}...`
                      )}
                      <AdviceButton onClick={() => openPopup(advice)}>
                        전체보기
                      </AdviceButton>
                    </td>
                    <td>{advice.QUESTION_TYPE === "share" ? "공유" : "저장"}</td>
                    <td>{advice.REGISTRATION_DT.split(" ")[0]}</td>
                  </tr>
                );
              })}
          </AdviceTableTBody>
        </TableOfAdvice>
        {paginationStateInfo && paginationStateInfo.totalItems &&
          <CommonPagination
            activePage={paginationStateInfo.pageNumber}
            itemsPerPage={paginationStateInfo.itemsPerPage}
            totalItems={paginationStateInfo.totalItems}
            handlePageChange={handlePageChange}
          ></CommonPagination>
        }
      </AdviceTableContainer>

      {/* 팝업 배경 */}
      <PopupBackground
        show={isPopupOpen}
        onClick={handleBackgroundClick}
      ></PopupBackground>

      {/* 팝업 컴포넌트 */}
      <Popup show={isPopupOpen}>
        <h2>글 내용</h2>
        <p>{selectedAdvice && selectedAdvice.ADVICE_TXT}</p>
        <CloseButton onClick={closePopup}>닫기</CloseButton>
      </Popup>
    </AdviceTableWapper>
  );
}

export default AdviceTable;
