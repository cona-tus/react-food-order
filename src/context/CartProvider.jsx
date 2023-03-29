import { useEffect, useReducer } from 'react';
import CartContext from './CartContext';

const getInitialCartState = () => {
  const cartState = localStorage.getItem('cartstate');
  return cartState
    ? JSON.parse(cartState)
    : {
        items: [],
        totalAmount: 0,
      };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );
      const exsitingCartItem = state.items[existingCartItemIndex];
      let updatedItems;
      if (exsitingCartItem) {
        const updatedItem = {
          ...exsitingCartItem,
          amount: exsitingCartItem.amount + action.item.amount,
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems = state.items.concat(action.item);
      }
      const updatedTotalAmount =
        state.totalAmount + action.item.price * action.item.amount;

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }
    case 'REMOVE': {
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      const exsitingCartItem = state.items[existingCartItemIndex];
      const updatedTotalAmount = state.totalAmount - exsitingCartItem.price;
      let updatedItems;
      if (exsitingCartItem.amount === 1) {
        updatedItems = state.items.filter((item) => item.id !== action.id);
      } else {
        const updatedItem = {
          ...exsitingCartItem,
          amount: exsitingCartItem.amount - 1,
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }
    case 'CLEAR': {
      return {
        items: [],
        totalAmount: 0,
      };
    }
    default: {
      return;
    }
  }
};

const CartProvider = ({ children }) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    getInitialCartState()
  );

  const addToCartHandler = (item) => {
    dispatchCartAction({
      type: 'ADD',
      item,
    });
  };

  const removeCartItemHandler = (id) => {
    dispatchCartAction({
      type: 'REMOVE',
      id,
    });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: 'CLEAR' });
  };

  useEffect(() => {
    localStorage.setItem('cartstate', JSON.stringify(cartState));
  }, [cartState]);

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addToCartHandler,
    removeItem: removeCartItemHandler,
    clearCart: clearCartHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};

export default CartProvider;
