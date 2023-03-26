import React, { useContext } from 'react';
import CartItem from './CartItem';
import CartContext from '../../context/CartContext';
import { GrPrevious } from 'react-icons/gr';
import styles from './Cart.module.css';

export default function Cart({ onClose }) {
  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItem = cartCtx.items.length > 0;

  const addCartItemHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const removeCartItemHandler = (id) => {
    cartCtx.removeItem(id);
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
      {!hasItem && (
        <p className={styles.fallback}>
          There are no items
          <br /> in your cart.
        </p>
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
          <button className={styles.button}>Checkout</button>
        </div>
      )}
    </section>
  );
}
