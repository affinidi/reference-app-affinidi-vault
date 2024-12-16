import { useContext } from "react";
import { ConsumerContext } from "src/lib/context/ConsumerContext";
import { useCartContext } from "src/lib/context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import * as S from "./index.styled";
import { useRouter } from "next/router";
import { GeoContext } from "src/lib/context/GeoContext";
import { getGeoSpecificPrice } from "src/lib/utils/shop-utils";

const Cart = () => {
  const [consumer] = useContext(ConsumerContext);
  const { items, removeItem } = useCartContext();
  const router = useRouter();
  const [geo] = useContext(GeoContext);

  const goToCheckout = () => {
    router.push("/checkout");
  };
  return (
    <S.Wrapper>
      <S.CartContainer>
        <S.Title>
          <div className=" text-xl w-1/2 px-32 pb-3 font-bold">
            Event Tickets...
          </div>
        </S.Title>
        {items.map((item, index) => (
          <S.ItemContainer key={index}>
            <div
              className={`m-1 border shadow-md px-2 ml-24 flex flex-row items-center justify-between w-2/3 rounded-full pl-2 pr-6`}
            >
              <div className="flex flex-row w-full">
                <img
                  className="p-1  w-10 h-10 mt-1 rounded-full"
                  src={item.product.imageUrl}
                  alt={item.product.name}
                />
                <div className="p-2 flex flex-row items-center space-x-12 mb-2 w-full 	">
                  <div className=" pl-5 pr-3 pt-2 w-1/2 text-xs">
                    {item.product.name}
                  </div>
                  <div className="text-xs font-bold text-red-500 pt-2 w-1/4">
                    {geo.currencySymbol}
                    {Number(
                      getGeoSpecificPrice(
                        item.product.price,
                        geo.currencyRate,
                        consumer.user && consumer.user.verified
                      ) || false
                    ) * item.quantity}
                    &nbsp;{geo.currency}
                  </div>
                  <div className="text-xs rounded-sm pt-2 w-1/8">
                    Qty&nbsp;{item.quantity}
                  </div>
                  <FontAwesomeIcon
                    onClick={() => removeItem(item.product.itemid)}
                    icon={faTrash}
                    className="w-1/8 text-blue-500 ml-6 mr-1 xse:ml-1 hover:cursor-pointer text-sm"
                  />
                </div>
              </div>
            </div>
          </S.ItemContainer>
        ))}
        <button
          onClick={goToCheckout}
          className={`p-2 bg-blue-500 text-xs mt-3 ml-32 pl-6 pr-6 mr-48 hover:bg-blue-700 text-white rounded-full`}
        >
          Proceed to Checkout
        </button>
      </S.CartContainer>
    </S.Wrapper>
  );
};
export default Cart;
