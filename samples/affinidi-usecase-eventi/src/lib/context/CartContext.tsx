import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

export interface ProductProps {
    itemid: number;
    name: string;
    description: string;
    date: string;
    startDate: string;
    endDate: string;
    location: string;
    price: number; 
    imageUrl: string;
    minEntry: number;
    genre: string;
} 

export interface CartItemProps {
    product: ProductProps;
    quantity: number;
}

interface CartProps {
    items: CartItemProps[];
    addItem: (item: CartItemProps) => void;
    removeItem: (itemid: number) => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [items, setItems] = useState<CartItemProps[]>([]);
    useEffect(() => {
        const alreadyAddedItems: CartItemProps[] = JSON.parse(localStorage.getItem('shopping-app-cart') || '[]');
        setItems(alreadyAddedItems);
    }, []);

    const addItem = (item: CartItemProps) => {
        let existsAlready = false;
        let updatedCart: CartItemProps[] = items.map((currentItem) => {
            if (currentItem.product.itemid == item.product.itemid) {
                currentItem.quantity++;
                existsAlready = true;
            }
            return currentItem;
        })

        if (!existsAlready) {
            updatedCart = [...updatedCart, { ...item }];
        }
        setItems(updatedCart);
        localStorage.setItem('shopping-app-cart', JSON.stringify(updatedCart));
    }

    const removeItem = (item: number) => {
        let updatedCart = items.map((eachItem) =>
            (eachItem.product.itemid === item) ? { ...eachItem, quantity: Math.max(0, eachItem.quantity - 1) } : eachItem
        );

        updatedCart = updatedCart.filter((eachItem) => eachItem.quantity > 0)

        setItems(updatedCart);
        localStorage.setItem('shopping-app-cart', JSON.stringify(updatedCart));
    }

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('shopping-app-cart');
    }


    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};

