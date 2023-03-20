import { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import CartItem from "../Cart/CartItem";
import Modal from "../UI/Modal";
import style from "./Cart.module.css";
import Chekout from "./Chekout";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const cartItems = (
    <ul className={style["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmiting(true);
    await fetch(
      "https://react-foods-bbbad-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.items,
        }),
      }
    );
    setIsSubmiting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const modalActions = (
    <div className={style.actions}>
      <button className={style["button--alt"]} onClick={props.onHideCart}>
        Close
      </button>
      {hasItems && (
        <button className={style.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      {cartItems}
      <div className={style.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Chekout onConfirm={submitOrderHandler} onClick={props.onHideCart} />
      )}
      {!isCheckout && modalActions}
    </>
  );

  const isSubmitingModalContent = <p>Sending order data...</p>;

  const didSubmitindModalContent = (
    <>
      <p>Successfuly sent the order!</p>
      <div className={style.actions}>
        <button className={style.button} onClick={props.onHideCart}>
          Close
        </button>
      </div>
    </>
  );

  return (
    <Modal onHideCart={props.onHideCart}>
      {!isSubmiting && !didSubmit && cartModalContent}
      {isSubmiting && isSubmitingModalContent}
      {!isSubmiting && didSubmit && didSubmitindModalContent}
    </Modal>
  );
};

export default Cart;
