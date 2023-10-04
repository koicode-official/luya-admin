"use client"
import styled from "styled-components"
import AdviceTable from "./AdviceTable";

const AdviceWrapper = styled.div`
  
`

function AdvicePresentaion() {
  return (
    <AdviceWrapper>
        <AdviceTable></AdviceTable>
    </AdviceWrapper>
  );
}

export default AdvicePresentaion;