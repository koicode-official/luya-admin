
"use client"
import styled from "styled-components"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import logoImage from "/public/img/logo_text05.png"
import { useEffect, useState } from "react"

const CommonMenuWrapper = styled.div`
  position: relative;
  height: 100vh;
  width: 15%;
  background-color: #f8f4ea;
  padding-top: 46px;
`

const CommonMenuContainer = styled.div`

  width: 100%;
  height: 100%;
  box-shadow: 1px 0px 10px rgba(0,0,0,0.1);
`

const MenuList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  margin-top: 20px;
`

const Menu = styled.li`
  width: 150px;
  padding: 10px;
  cursor: pointer;
  ${props => props.active === true ? "color:#232323;font-weight:bold;" : "color:#777777;"}
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`



function CommonMenu() {
  const router = useRouter();
  const pathName = usePathname();

  const handleRouter = (url) => {
    router.push(url)
  }

  return (
    <CommonMenuWrapper>
      <CommonMenuContainer>
        <LogoContainer>
          <Image width={100} height={56} src={logoImage} alt="logo"></Image>
        </LogoContainer>
        <MenuList>
          <Menu onClick={() => handleRouter("/user")} active={pathName === "/admin/user"}>
            유저
          </Menu>
          <Menu onClick={() => handleRouter("/pray")} active={pathName === "/admin/pray"}>
            기도제목
          </Menu>
          <Menu onClick={() => handleRouter("/advice")} active={pathName === "/admin/advice"}>
            성경AI
          </Menu>
        </MenuList>
      </CommonMenuContainer>
    </CommonMenuWrapper>
  );
}

export default CommonMenu;