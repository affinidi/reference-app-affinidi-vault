import { Modal as ReactModal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styled from "styled-components";

import { pxToRem } from "utils";

export const Modal = styled(({ classNames, ...rest }) => (
  <ReactModal {...rest} classNames={{ ...classNames }} />
))`
  .modal {
    background: red;
    color: red;
  }

  .react-responsive-modal-container {
    background: red;
  }

  .react-responsive-modal-modal {
    background: red;
    color: #6a6a6a;
  }
`;

export const ModalWrapper = styled.div`
  margin: ${pxToRem(48)};
  width: ${pxToRem(370)};
`;

export const Title = styled.div`
  margin: ${pxToRem(16)} ${pxToRem(12)} ${pxToRem(32)} 0;
  font-family: "lora";
  font-size: ${pxToRem(52)};
  font-weight: bold;
  color: #10375c;
`;

export const SubTitle = styled.div`
  margin: ${pxToRem(32)} ${pxToRem(16)} ${pxToRem(24)} 0;
  font-family: "lato";
  font-size: ${pxToRem(20)};
  line-height: 1.5;
  color: #6a6a6a;
`;
