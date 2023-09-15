import { FC, useState } from "react";
import "react-responsive-modal/styles.css";

import { hostUrl } from "utils/env_public";

import * as S from "./ErrorModal.styled";

type ModalProps = {
  error: string;
  errorDescription?: string;
};

const ErrorModal: FC<ModalProps> = ({ error, errorDescription }) => {
  const [open, setOpen] = useState(true);

  async function onCloseModal() {
    setOpen(false);
    window.location.href = hostUrl;
  }

  return (
    <S.Modal open={open} onClose={onCloseModal} center>
      <S.ModalWrapper>
        <S.Title>Whoops!</S.Title>
        <S.SubTitle>
          Something went wrong, please try again.
          <br />
          <br />
          Reason: {error}
          {errorDescription ? (
            <>
              <br />
              {errorDescription}
            </>
          ) : (
            ""
          )}
        </S.SubTitle>
      </S.ModalWrapper>
    </S.Modal>
  );
};

export default ErrorModal;
