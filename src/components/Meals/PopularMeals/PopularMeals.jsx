import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import './swiper.css';

import { AiFillStar } from 'react-icons/ai';
import styles from './PopularMeals.module.css';
import p1 from '../../../assets/p1ricecake.png';
import p2 from '../../../assets/p2ramen.png';
import p3 from '../../../assets/p3pizza.png';

const POPULAR_MEALS = [
  {
    id: 'p1',
    name: 'Tteokbokki',
    price: 4.48,
    url: p1,
  },
  {
    id: 'p2',
    name: 'Ramen',
    price: 12.35,
    url: p2,
  },
  {
    id: 'p3',
    name: 'Delux Pizza',
    price: 21.61,
    url: p3,
  },
];

export default function PopularMeals() {
  return (
    <Swiper slidesPerView={2} spaceBetween={50} rewind={true}>
      {POPULAR_MEALS.map((meal) => (
        <SwiperSlide key={meal.id}>
          <img src={meal.url} alt={meal.name} />
          <div className={styles.content}>
            <span className={styles.stars}>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
            </span>
            <h3 className={styles.name}>{meal.name}</h3>
            <span className={styles.price}>${meal.price}</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
