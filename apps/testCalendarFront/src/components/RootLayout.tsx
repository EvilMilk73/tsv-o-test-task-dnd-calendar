import styled from "@emotion/styled";
import { type ReactNode } from "react";

const LayoutWrapper = styled.div`
  position: fixed;
  inset: 0; /* shorthand for top: 0; right: 0; bottom: 0; left: 0; */
  overflow: hidden;
  background-color: #f9f9f9;
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #2d2d2d;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding: 20px;
  background-color: white;
`;

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <LayoutWrapper>
      <TopBar></TopBar>
      <Content>{children}</Content>
    </LayoutWrapper>
  );
};

export default RootLayout;
