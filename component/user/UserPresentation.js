"use client"
import styled from "styled-components"
import UserTable from "./UserTable";

const UserWrapper = styled.div`
  
`

function UserPresentaion() {
  return (
    <UserWrapper>
        <UserTable></UserTable>
    </UserWrapper>
  );
}

export default UserPresentaion;