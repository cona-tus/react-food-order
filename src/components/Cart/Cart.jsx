import React, { useContext, useState } from 'react';
import CartItem from './CartItem';
import CartContext from '../../context/CartContext';
import { GrPrevious } from 'react-icons/gr';
import { MdDeliveryDining } from 'react-icons/md';
import styles from './Cart.module.css';
import Confetti from 'react-confetti';

export default function Cart({ onClose }) {
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItem = cartCtx.items.length > 0;

  const addCartItemHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const removeCartItemHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = () => {
    setIsCheckout(true);
    cartCtx.clearCart();
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <button className={styles.prev} onClick={onClose}>
          <GrPrevious />
        </button>
        <h2 className={styles.title}>
          My
          <br /> Cart List
        </h2>
      </header>
      {!hasItem && !isCheckout && (
        <p className={styles.fallback}>There are no items in your cart.</p>
      )}
      {isCheckout && (
        <>
          <Confetti
            opacity={0.7}
            numberOfPieces={300}
            gravity={0.3}
            recycle={false}
          />
          <div className={styles.order}>
            <MdDeliveryDining className={styles.icon} />
            <p className={styles.message}>Successfully sent the order!</p>
          </div>
        </>
      )}
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onAdd={addCartItemHandler.bind(null, item)}
            onRemove={removeCartItemHandler.bind(null, item.id)}
          />
        ))}
      </ul>
      {hasItem && (
        <div className={styles.bill}>
          <div className={styles.total}>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
          </div>
          <button className={styles.button} onClick={orderHandler}>
            Checkout
          </button>
        </div>
      )}
    </section>
  );
}
