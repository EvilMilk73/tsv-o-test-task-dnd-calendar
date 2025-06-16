/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { getMonthName } from "../../utils/datetime";
import { css } from "@emotion/react";
import { ArrowDown, ArrowUp } from "lucide-react";

const ControlsHeaderRowContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-content: center;
`;

const HeaderButton = styled.button`
  margin: 10px;
  width: 75px;
  height: 50px;

  font-weight: bold;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f0f0f0;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    background-color: #d0d0d0;
  }
`;

const SearchBar = styled.input`
  padding: 0px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
  font-size: 16px;
  height: 2rem;
`;

export function ControlsHeaderRow({
  handleNext,
  handlePrev,
  currentMonthIndex,
  currentYear,
  setSearchQuery,
}: {
  handleNext: () => void;
  handlePrev: () => void;
  currentMonthIndex: number;
  currentYear: number;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <ControlsHeaderRowContainer>
      <div
        css={css`
          display: flex;
          flex: 1;

          justify-content: start;
        `}
      >
        <HeaderButton onClick={handlePrev}>
          <ArrowUp></ArrowUp>
        </HeaderButton>
        <HeaderButton onClick={handleNext}>
          <ArrowDown></ArrowDown>
        </HeaderButton>
      </div>
      <span
        css={css`
          font-size: x-large;
          text-align: center;
          flex: 1;
        `}
      >
        {getMonthName(currentMonthIndex) + "   " + currentYear}
      </span>

      <div
        css={css`
          display: flex;
          flex: 1;
          justify-content: end;
          align-items: center;
          padding-right: 20px;
        `}
      >
        <SearchBar
          placeholder="Search for task"
          onChange={(e) => setSearchQuery(e.target.value)}
        ></SearchBar>
      </div>
    </ControlsHeaderRowContainer>
  );
}
