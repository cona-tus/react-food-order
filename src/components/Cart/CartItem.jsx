import React from 'react';
import styles from './CartItem.module.css';

export default function CartItem({ item, onAdd, onRemove }) {
  const { url, name, price, amount } = item;

  return (
    <li className={styles['cart-item']}>
      <img src={url} alt={name} />
      <div className={styles.meal}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.price}>${price}</span>
        <span className={styles.amount}>×{amount}</span>
      </div>
      <div className={styles.actions}>
        <button onClick={onRemove}>−</button>
        <button onClick={onAdd}>+</button>
      </div>
    </li>
  );
}
