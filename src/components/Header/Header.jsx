import React from 'react';
import HeaderCartButton from './HeaderCartButton';
import { BsFillEmojiWinkFill } from 'react-icons/bs';
import styles from './Header.module.css';

export default function Header({ onShowCart }) {
  return (
    <>
      <header className={styles.header}>
        <BsFillEmojiWinkFill className={styles.logo} />
        <div className={styles.text}>
          <h1 className={styles.title}>DoorWink</h1>
          <p className={styles.subtitle}>Home Delivery Service</p>
        </div>
        <HeaderCartButton onShowCart={onShowCart} />
      </header>
    </>
  );
}
