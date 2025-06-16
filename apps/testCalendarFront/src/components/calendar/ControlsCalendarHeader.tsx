/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { getMonthName } from "../../utils/datetime";
import { css } from "@emotion/react";

const ControlsHeaderRowContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-content: center;
`;

const HeaderButton = styled.button`
  margin: 20px auto;
  display: block;
  width: 100px;
  height: 40px;
  background: #0077cc;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border-radius: 8px;
`;

export function ControlsHeaderRow({
  handleNext,
  handlePrev,
  currentMonthIndex,
  currentYear,
}: {
  handleNext: () => void;
  handlePrev: () => void;
  currentMonthIndex: number;
  currentYear: number;
}) {
  return (
    <ControlsHeaderRowContainer>
      <HeaderButton onClick={handlePrev}>Prev</HeaderButton>
      <span
        css={css`
          font-size: x-large;
          text-align: center;
        `}
      >
        {getMonthName(currentMonthIndex) + "   " + currentYear}
      </span>
      <HeaderButton onClick={handleNext}>Next</HeaderButton>
    </ControlsHeaderRowContainer>
  );
}
