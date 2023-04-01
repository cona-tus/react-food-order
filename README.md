# 🥘 음식 배달주문 앱, 'DoorWink' 토이 프로젝트

![door-thumb](https://user-images.githubusercontent.com/90844424/228430702-6c0cac77-e860-4115-b810-82fb56dd2bf4.jpg)

<br />

[![Netlify Status](https://api.netlify.com/api/v1/badges/d758b521-3302-4c73-8af2-3afbc0899196/deploy-status)](https://app.netlify.com/sites/conatus-react-food-order/deploys) | [Live Demo](https://conatus-react-food-order.netlify.app/)

<br/>
<br/>

# 1. Project

## 1-1. Project Information

> 도어윙크(DoorWink)는 음식 배달주문 앱입니다. 음식을 카트에 추가하여 수량을 카운팅하고, 총계를 합산하는 간단한 기능으로 이루어져 있습니다.

<br/>

## 1-2. Project Duration & Participants

- 2023-3-25 ~ 2023-3-29
- 개인 프로젝트 (1인)

<br/>
<br/>

# 2. Skills

![REACT](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=ffffff)
![POSTCSS](https://img.shields.io/badge/Postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=ffffff)
![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)

<br/>
<br/>

# 3. Main Features

주요 기능은 다음과 같습니다.

> 1. 아이템을 추가하기
> 2. 아이템을 삭제하기
> 3. 아이템, 수량, 총계를 업데이트하고, 출력하기

```jsx
import React from 'react';

// 아이템을 카트에 추가, 삭제, 업데이트하기 위해 카트 데이터를 Context로 관리합니다.
// 그러면 컨텍스트에 접근하려는 모든 컴포넌트에 카트 데이터를 제공할 수 있습니다.
const CartContext = React.createContext();

export default CartContext;
```

```jsx
function App() {
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  // CartProvider로 카트에 접근하는 컴포넌트들을 감싸줍니다.
  // 컨텍스트의 영향을 받는 모든 컴포넌트는 카트 데이터가 변경될 때마다 재평가됩니다.
  return (
    <CartProvider>
      <Header onShowCart={showCartHandler} />
      {!cartIsShown && <Meals />}
      {cartIsShown && <Cart onClose={hideCartHandler} />}
    </CartProvider>
  );
}

export default App;
```

![door-local](https://user-images.githubusercontent.com/90844424/229258910-9eb2a485-6502-45c8-8673-a29098c5b2f2.jpg)

```jsx
import { useEffect, useReducer } from 'react';
import CartContext from './CartContext';

// 로컬스토리지 데이터를 불러와 초기 state를 설정합니다.
// 로컬스토리지에 'cartstate'가 있다면 파싱하여 가져오고, 없다면 객체를 기본값으로 지정합니다.
const getInitialCartState = () => {
  const cartState = localStorage.getItem('cartstate');
  return cartState
    ? JSON.parse(cartState)
    : {
        items: [],
        totalAmount: 0,
      };
};

const CartProvider = ({ children }) => {
  // useReducer를 사용하여 state를 관리합니다.
  // useReducer(reducer함수, 초기state)로 설정합니다.
  // state와 action 함수를 디스트럭처링하여 변수에 저장합니다.
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    getInitialCartState()
  );

  // 액션 유형을 식별하기 위해 속성 이름으로 type을 사용합니다.
  // 추가
  const addToCartHandler = (item) => {
    dispatchCartAction({
      type: 'ADD',
      item,
    });
  };

  // 삭제
  const removeCartItemHandler = (id) => {
    dispatchCartAction({
      type: 'REMOVE',
      id,
    });
  };

  // 초기화
  const clearCartHandler = () => {
    dispatchCartAction({ type: 'CLEAR' });
  };

  // 카트 데이터가 변경될 때마다 로컬스토리지에 데이터를 json형태로 저장합니다.
  // 이를 위해 useEffect 훅을 사용하여 cartState를 디펜던시로 지정합니다.
  useEffect(() => {
    localStorage.setItem('cartstate', JSON.stringify(cartState));
  }, [cartState]);

  // 컨텍스트를 구성합니다.
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
```

<br/>

## 3-1. Add Item to Cart

![door-update](https://user-images.githubusercontent.com/90844424/228698114-18a2d1b6-f1d2-47ce-890d-ff14bf087c52.gif)

> 메뉴 리스트에서 `+` 버튼을 눌러 카트에 아이템을 한 개씩 추가할 수 있습니다. 카트 리스트에서 아이템의 `+` 버튼을 눌러 수량을 변경할 수 있습니다.

아이템과 수량을 추가하거나 업데이트하기 위해 선택한 아이템이 이미 카트에 있는지 확인합니다. 있다면 기존 아이템의 수량을 업데이트하고, 없다면 새 아이템을 추가합니다.

```js
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      // findIndex 메서드를 사용하여 아이템 id와 action으로 추가되는 아이템 id가 동일한 경우 해당 아이템의 인덱스를 반환합니다.
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );
      // items의 index에 접근해서 아이템을 선택하고 변수 existingCartItem에 할당합니다.
      const exsitingCartItem = state.items[existingCartItemIndex];

      let updatedItems;

      // 아이템이 이미 존재하는 경우에만 기존 아이템을 복사하고, 수량과 추가할 수량을 더하여 업데이트 합니다.
      if (exsitingCartItem) {
        const updatedItem = {
          ...exsitingCartItem,
          amount: exsitingCartItem.amount + action.item.amount,
        };

        // 이전 객체를 복사하여 새 배열을 만듭니다.
        updatedItems = [...state.items];

        // updatedItems의 index에 접근하여 기존 아이템을 선택하고, 이를 updatedItem으로 덮어씁니다.
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        // 기존 배열에 아이템이 없는 경우, updatedItems 배열에 새로운 아이템을 추가합니다.
        // 기존 state를 편집하지 않으려면 새로운 배열을 반환하는 concat 메서드를 사용합니다.
        updatedItems = state.items.concat(action.item);
      }
      // 총계를 계산합니다.
      const updatedTotalAmount =
        state.totalAmount + action.item.price * action.item.amount;

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }
  }
};
```

MealItem에서 추가할 item을 전달하기 위해 useContext를 호출합니다.

```jsx
export default function MealItem({ meal }) {
  const { url, name, description, price } = meal;

  const cartCtx = useContext(CartContext);

  // 컨텍스트에서 정의된 메서드인 cartCtx.addItem을 호출하여 reducer에 아이템을 전달합니다.
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
```

<br/>

## 3-2. Remove Cart Item

![door-remove](https://user-images.githubusercontent.com/90844424/228698646-7300a8a2-e1ec-4951-a0c0-ee5eec214ecd.gif)

> 카트에 아이템이 있는 경우 `-` 버튼을 클릭하면 수량을 1씩 줄입니다. 수량이 1일 때 -1을 하면 해당 아이템을 카트에서 삭제합니다.

```js
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'REMOVE': {
      // findIndex 메서드를 사용하여 액션으로 얻은 id를 가진 아이템, 즉 삭제할 아이템의 인덱스를 찾습니다.
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      // 기존 아이템 배열의 index에 접근하여 아이템을 선택합니다.
      const exsitingCartItem = state.items[existingCartItemIndex];

      // 총계를 계산합니다.
      const updatedTotalAmount = state.totalAmount - exsitingCartItem.price;
      let updatedItems;

      // 기존 아이템의 수량이 1이라면 이것은 카트에 있는 마지막 아이템입니다. 이것을 배열에서 삭제합니다.
      if (exsitingCartItem.amount === 1) {
        // filter 메서드를 사용하여 item.id가 action.id와 같지 않은 아이템만 필터링해 새 배열을 반환합니다. 새로 생성된 배열에서 두 id가 같은 아이템을 삭제합니다.
        updatedItems = state.items.filter((item) => item.id !== action.id);
      } else {
        // 수량이 1보다 크면 배열에서 아이템을 삭제하지 않고, 수량만 업데이트합니다.
        const updatedItem = {
          ...exsitingCartItem,
          amount: exsitingCartItem.amount - 1,
        };
        // 배열에서 이전 항목을 덮어씁니다.
        updatedItems = [...state.items];
        // 업데이트된 수량이 있는 updatedItem으로 덮어씁니다.
        updatedItems[existingCartItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    }
  }
};
```

## 3-3. Show Cart List

![door-cart](https://user-images.githubusercontent.com/90844424/229258909-47f71c40-195c-4e06-90db-2298615cfddc.jpg)

```jsx
export default function Cart({ onClose }) {
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItem = cartCtx.items.length > 0;

  // cartCtx의 addItem을 호출하고 item을 전달합니다. 그러면 CartProvider에서 addItem 함수가 트리거됩니다.
  const addCartItemHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  // CartCtx를 호출하고 removeItem에 id를 전달합니다.
  const removeCartItemHandler = (id) => {
    cartCtx.removeItem(id);
  };

  // Checkout 버튼을 누르면 카트가 초기화됩니다.
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
            numberOfPieces={150}
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
            // onAdd, onRemove props를 추가합니다.
            // bind를 호출하여 함수가 실행될 때 받을 인수를 미리 구성할 수 있습니다. item과 item.id를 받도록 합니다.
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
```

<br/>

# 4. UI/UX

## 4-1. Cart Animation

![door-animation](https://user-images.githubusercontent.com/90844424/228526883-d59926b3-370d-4b0a-ad14-687299a2d5de.gif)

> 카트 데이터가 변경될 때마다 카트 아이콘에 애니메이션이 재생됩니다.

```jsx
// HeaderCartButton 컴포넌트는 카트 아이템 수량을 표시합니다.
export default function HeaderCartButton({ onShowCart }) {
  // useState를 사용하여 버튼의 애니메이션 상태를 저장합니다.
  const [btnIsAnimated, setBtnIsAnimated] = useState(false);

  // useContext를 호출하여 cartCxt.items에 접근합니다.
  const cartCtx = useContext(CartContext);
  // 전체 컨텍스트가 아니라 디스트럭처링을 사용해 items 배열만 꺼내옵니다.
  const { items } = cartCtx;

  // 아이템의 수량을 나타내기 위해 reduce 메서드를 사용하여 데이터 배열을 하나의 값으로 변환해줍니다.
  const numberOfCartItems = items.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);

  // 삼항 연산자로 btnIsAnimated가 true일 때 bump 클래스를 붙여줍니다.
  const btnClasses = `${styles.button} ${btnIsAnimated ? styles.bump : ''}`;

  // cartCtx.items를 디펜던시로 전달하여 수량이 변경될 때마다 애니메이션을 추가합니다.
  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    setBtnIsAnimated(true);

    // 애니메이션이 끝난 후에 타이머를 설정하여 btnIsAnimated를 다시 false로 설정하는 함수를 트리거합니다.
    const timer = setTimeout(() => {
      setBtnIsAnimated(false);
    }, 300);

    // 클린업 함수에서 clearTimeOut을 호출하고 타이머를 지웁니다.
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
```

<br/>

## 4-2. Responsive Web

![door-responsive](https://user-images.githubusercontent.com/90844424/229258431-d3fe7735-bed9-479d-a1ea-24b6ca563618.jpg)

도어윙크 앱은 반응형 웹으로 디자인되었습니다. 미디어쿼리를 지정해 480px 이하에서는 width와 height를 100%로 설정하여 화면 전체를 꽉 채울 수 있도록 합니다.

```css
@media (max-width: 480px) {
  #root {
    height: 100%;
    max-width: 100%;
    border-radius: 0;
  }
}
```

<br/>
<br/>

<sub>본 애플리케이션은 인터넷 강의를 참고하여 만들었으며, 필요에 따라 원본 코드를 수정하였습니다. 기능을 보완하거나 추가했으며 또한 새롭게 디자인했습니다.</sub>
