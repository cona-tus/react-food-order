import React, { useContext } from 'react';
import CartContext from '../../../context/CartContext';
import { FaPlus } from 'react-icons/fa';
import styles from './MealItem.module.css';

export default function MealItem({ meal }) {
  const { url, name, description, price } = meal;
  const cartCtx = useContext(CartContext);

  const addToCartHandler = () => {
    cartCtx.addItem({
      id: meal.id,
      name: meal.name,
      amount: 1,
      price: meal.price,
      url: meal.url,
    });
  };

  return (
    <li className={styles.item}>
      <img src={url} alt={name} />
      <div className={styles.meal}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.desc}>{description}</p>
        <span className={styles.price}>${price}</span>
      </div>

      <button className={styles.button} onClick={addToCartHandler}>
        <FaPlus />
      </button>
    </li>
  );
}
