
import { useContext } from "react";
import { ProductProps, CartContext, useCartContext } from "src/lib/context/CartContext";
import { ConsumerContext } from "src/lib/context/ConsumerContext"; 
import { GeoContext } from "src/lib/context/GeoContext"; 
import * as S from "./index.styled";
import { useRouter } from 'next/router';

interface Props {
    product: ProductProps;
}

const ProductDisplay: React.FC<Props> = ({product}) => {

    const [userInfo] = useContext(ConsumerContext);
    const [geo] = useContext(GeoContext);
    const { addItem }= useCartContext();

    const router = useRouter();

    const handleBuyClick = () => {
    addItem({ product: product, quantity: 1 });
    router.push('/checkout'); // Replace with your target URL
    };
   
    return (
        <div className="border-2 rounded-2xl text-center flex flex-col justify-between m-4" style={{ width: '300px' }} >
            <img src={product.imageUrl} alt={product.name} className="border-0 rounded-t-xl max-h-32 w-full pb-3" />

            <div className="font-semibold p-4" style={{ fontSize: '19px'}}>{product.name} - {product.genre}</div>
            <div className="font-semibold p-4" style={{ fontSize: '14px'}}>{product.date}</div>
            <div className="font-semibold" style={{ fontSize: '17px'}}>Location : {product.location}</div>

            <button onClick={handleBuyClick} className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-600 text-xs m-6">Buy  $ { product.price}</button>
        </div>
    )
}

export default ProductDisplay;
