import React from 'react';
import PopularMeals from './PopularMeals/PopularMeals';
import MealItem from './MealItem/MealItem';
import styles from './Meals.module.css';
import m1 from '../../assets/m1ricecake.png';
import m2 from '../../assets/m2ramen.png';
import m3 from '../../assets/m3pizza.png';
import m4 from '../../assets/m4tomyam.png';
import m5 from '../../assets/m5omeletrice.png';
import m6 from '../../assets/m6chicken.png';
import m7 from '../../assets/m7curry.png';
import m8 from '../../assets/m8applepie.png';
import m9 from '../../assets/m9pancake.png';
import m10 from '../../assets/m10pasta.png';

const MEALS = [
  {
    id: 'm1',
    name: 'Tteokbokki',
    description: 'Korean, rice cake, chili sauce',
    price: 4.48,
    url: m1,
  },
  {
    id: 'm2',
    name: 'Ramen',
    description: 'Japanese noodle, sliced pork',
    price: 12.35,
    url: m2,
  },
  {
    id: 'm3',
    name: 'Delux Pizza',
    description: 'American, tomatoes, cheese',
    price: 21.61,
    url: m3,
  },
  {
    id: 'm4',
    name: 'Tom Yum Soup',
    description: 'Thai, hot and sour flavours',
    price: 13.12,
    url: m4,
  },
  {
    id: 'm5',
    name: 'Omelet Rice',
    description: 'Japanese, soft layer of egg',
    price: 26,
    url: m5,
  },
  {
    id: 'm6',
    name: 'Chicken Skewers',
    description: 'Korean, marinated chicken',
    price: 7.99,
    url: m6,
  },
  {
    id: 'm7',
    name: 'Spicy Curry',
    description: 'Indian, vegetable with naan',
    price: 16.98,
    url: m7,
  },
  {
    id: 'm8',
    name: 'Apple pie',
    description: 'American, pie with ice cream',
    price: 26.24,
    url: m8,
  },
  {
    id: 'm9',
    name: 'Pancake',
    description: 'American, sweet flat cake',
    price: 9.26,
    url: m9,
  },
  {
    id: 'm10',
    name: 'Tomato Spaghetti ',
    description: 'Italian, tomato with basil',
    price: 23.15,
    url: m10,
  },
];

export default function Meals() {
  return (
    <section className={styles.container}>
      <div className={styles.meals}>
        <h2 className={styles.title}>Most Popular</h2>
        <PopularMeals />
        <h2 className={styles.title}>Menu</h2>
        <ul className={styles.list}>
          {MEALS.map((meal) => (
            <MealItem id={meal.id} key={meal.id} meal={meal} />
          ))}
        </ul>
      </div>
    </section>
  );
}
