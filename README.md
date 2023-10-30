# 🥘 음식 배달 주문 앱, 'DoorWink' 토이 프로젝트

![door-thumb](https://user-images.githubusercontent.com/90844424/228430702-6c0cac77-e860-4115-b810-82fb56dd2bf4.jpg)

<br/>

🔗 DoorWink [[Live Demo](https://conatus-react-food-order.netlify.app/)]

<br/>
<br/>

## 1. Project

### 1-1. Project Description

DoorWink는 음식 배달 주문 앱입니다. 음식을 카트에 추가하여 수량을 카운팅하고, 총계를 합산하는 간단한 기능으로 이루어져 있습니다.

<br/>

<sub>\* 본 애플리케이션은 인터넷 강의를 참고하여 만들었으나, 필요하다고 판단되는 부분에서 원본 코드를 수정했습니다. 그리고 주문 기능을 추가하였습니다. 또한 새롭게 디자인했습니다.</sub>

<br/>

### 1-2. Project Duration & Participants

- 2023-3-25 ~ 2023-3-29
- 개인 프로젝트 (1인)

<br/>
<br/>

## 2. Skills

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-f6e158?style=for-the-badge&logo=JavaScript&logoColor=ffffff)
![REACT](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=ffffff)
![POSTCSS](https://img.shields.io/badge/Postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=ffffff)
![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)

<br/>
<br/>

## 3. Main Features

1. [아이템 상태 관리]()
2. [아이템 추가]()
3. [아이템 삭제]()
4. [아이템 출력]()

<br/>

### 3-1. Handle Context

아이템을 카트에 추가, 삭제, 업데이트하기 위해 카트 데이터를 Context로 관리합니다. 그러면 컨텍스트에 접근하려는 모든 컴포넌트에 카트 데이터를 제공할 수 있습니다.

```jsx
function App() {
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

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

<br/>

![door-local](https://user-images.githubusercontent.com/90844424/229258910-9eb2a485-6502-45c8-8673-a29098c5b2f2.jpg)

로컬 스토리지 데이터를 불러와 초기 상태를 설정합니다. 로컬 스토리지에 `cartstate`가 있다면 파싱하여 가져오고, 없다면 객체를 기본값으로 지정합니다.

```jsx
const getInitialCartState = () => {
  const cartState = localStorage.getItem('cartstate');
  return cartState
    ? JSON.parse(cartState)
    : {
        items: [],
        totalAmount: 0,
      };
};
```

<br/>

useReducer를 사용해 상태를 관리하고, type을 사용해 action 유형을 식별합니다. 그리고 useEffect로 카트 데이터가 변경될 때마다 로컬 스토리지에 데이터를 JSON 형태로 저장합니다.

```jsx
const CartProvider = ({ children }) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    getInitialCartState()
  );

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

  useEffect(() => {
    localStorage.setItem('cartstate', JSON.stringify(cartState));
  }, [cartState]);

  // 컨텍스트 구성
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
<br/>

### 3-2. Add Item to Cart

![door-update](https://user-images.githubusercontent.com/90844424/228698114-18a2d1b6-f1d2-47ce-890d-ff14bf087c52.gif)

아이템과 수량을 추가하거나 업데이트하기 위해 선택한 아이템이 이미 카트에 있는지 확인합니다. 있다면 기존 아이템의 수량을 업데이트하고, 없다면 새 아이템을 추가합니다.

`findIndex()` 메서드를 사용하여 item.id와 action으로 추가되는 item.id가 동일한 아이템의 인덱스를 반환합니다. 이 인덱스를 사용해 items 배열에서 아이템을 선택하고, 이를 `existingCartItem` 변수에 할당합니다.

```js
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );

      const exsitingCartItem = state.items[existingCartItemIndex];
```

<br/>

아이템이 이미 존재하는 경우에만 기존 아이템을 복사하고, 수량과 추가할 수량을 더하여 업데이트합니다. 기존 배열에 아이템이 없는 경우, updatedItems 배열에 새로운 아이템을 추가합니다. 이때, 기존 state를 편집하지 않으려면 새로운 배열을 반환하는 `concat()` 메서드를 사용합니다.

```js
      let updatedItems;

    // 아이템 업데이트
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

    // 총계 계산
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

<br/>

추가할 item을 전달하기 위해 useContext를 호출합니다. 컨텍스트에서 정의된 메서드인 `addItem()`을 호출하여 리듀서에 아이템을 전달합니다.

```jsx
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

  // return ()
}
```

<br/>
<br/>

### 3-3. Remove Cart Item

![door-remove](https://user-images.githubusercontent.com/90844424/228698646-7300a8a2-e1ec-4951-a0c0-ee5eec214ecd.gif)

카트에 아이템이 있는 경우 `-` 버튼을 클릭하면 수량을 1씩 줄입니다. 수량이 1일 때 -1을 하면 해당 아이템을 카트에서 삭제합니다. 기존 아이템의 수량이 1이라면, `filter()` 메서드를 사용해서 아이템을 배열에서 삭제합니다. 수량이 1보다 크면 배열에서 아이템을 삭제하지 않고, 수량만 업데이트합니다.

```js
const cartReducer = (state, action) => {
  switch (action.type) {
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
  }
};
```

<br/>
<br/>

### 3-4. Show Cart List

![door-cart](https://user-images.githubusercontent.com/90844424/229258909-47f71c40-195c-4e06-90db-2298615cfddc.jpg)

cartCtx의 addItem을 호출해 item을 전달하며, removeItem에 id를 전달합니다. 그리고 props로 onAdd, onRemove를 추가합니다. bind를 호출하여 함수가 실행될 때 받을 인수를 미리 구성할 수 있습니다. item과 item.id를 받도록 합니다.

```jsx
export default function Cart({ onClose }) {
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItem = cartCtx.items.length > 0;


  // 추가
  const addCartItemHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };


  // 삭제
  const removeCartItemHandler = (id) => {
    cartCtx.removeItem(id);
  };

  // 초기화
  const orderHandler = () => {
    setIsCheckout(true);
    cartCtx.clearCart();
  };
```

```jsx
  return (
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
  );
}
```

<br/>
<br/>

## 4. UI/UX

### 4-1. Cart Animation

![door-animation](https://user-images.githubusercontent.com/90844424/228526883-d59926b3-370d-4b0a-ad14-687299a2d5de.gif)

카트 데이터가 변경될 때마다 Header의 카트 아이콘에 애니메이션이 재생됩니다. 삼항 연산자로 `btnIsAnimated`가 true일 때 `bump` 클래스를 붙여줍니다.
cartCtx.items를 디펜던시로 전달하여 수량이 변경될 때마다 애니메이션을 추가합니다. 애니메이션이 끝난 후에 타이머를 설정하여 btnIsAnimated를 다시 false로 설정하는 함수를 트리거 합니다. 클린업 함수에서 `clearTimeOut`을 호출하고 타이머를 지웁니다.

```jsx
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

  // return ();
}
```

<br/>
<br/>

### 4-2. Responsive Web Design

![door-responsive](https://user-images.githubusercontent.com/90844424/229258431-d3fe7735-bed9-479d-a1ea-24b6ca563618.jpg)

DoorWink는 반응형 웹으로 디자인되었습니다. 미디어 쿼리를 지정해 480px 이하에서는 width와 height를 100%로 설정하여 화면 전체를 꽉 채울 수 있도록 합니다.

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

[맨위로 이동하기](#-음식-배달주문-앱-doorwink-토이-프로젝트)
