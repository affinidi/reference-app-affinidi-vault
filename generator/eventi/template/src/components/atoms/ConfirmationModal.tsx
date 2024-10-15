import * as S from "../LandingPage/index.styled";

interface ConfirmationModalProps {
  closeModal: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ closeModal }) => {
  return (
    <S.Wrapper>
      <div className="fixed inset-1 flex items-center justify-center bg-gray-100 bg-opacity-50  flex-col text-xl">
      
      <div className="p-6 mt-2 rounded-lg text-center border shadow bg-white text-black font-bold text-sm">
        <p> Order submitted. Thank you for shopping with us!</p><br/>
        <button onClick={closeModal} className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-black text-sm ">
          Continue Shopping
        </button> &nbsp;&nbsp;&nbsp;
      </div>
    </div>
    </S.Wrapper>
  );
};

export default ConfirmationModal;
