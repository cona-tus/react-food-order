import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../../context/CartContext';
import { HiShoppingCart } from 'react-icons/hi';
import styles from './HeaderCartButton.module.css';

export default function HeaderCartButton({ onShowCart }) {
  const [btnIsAnimated, setBtnIsAnimated] = useState(false);
  const cartCtx = useContext(CartContext);
  const { items } = cartCtx;

  const numberOfCartItems = items.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);

  const btnClasses = `${styles.button} ${btnIsAnimated ? styles.bump : ''}`;

  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    setBtnIsAnimated(true);

    const timer = setTimeout(() => {
      setBtnIsAnimated(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  return (
    <button className={btnClasses} onClick={onShowCart}>
      <span className={styles.icon}>
        <HiShoppingCart />
      </span>
      <span className={styles.badge}>{numberOfCartItems}</span>
    </button>
  );
}
