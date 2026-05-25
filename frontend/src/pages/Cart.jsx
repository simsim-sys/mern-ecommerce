import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Your cart is empty</h2>
      <button
        onClick={() => navigate('/')}
        style={{ padding: '0.75rem 2rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Shop Now
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h1>Your Cart</h1>
      {cart.map(item => (
        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', marginBottom: '0.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div>
            <h3>{item.name}</h3>
            <p style={{ color: '#666' }}>${item.price} x {item.qty}</p>
            <p style={{ fontWeight: 'bold' }}>Subtotal: ${(item.price * item.qty).toFixed(2)}</p>
          </div>
          <button
            onClick={() => removeFromCart(item._id)}
            style={{ background: 'red', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Remove
          </button>
        </div>
      ))}

      <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', marginTop: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'right' }}>Total: ${total.toFixed(2)}</h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={clearCart}
            style={{ padding: '0.75rem 1.5rem', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear Cart
          </button>
          <button
            onClick={() => navigate('/checkout')}
            style={{ padding: '0.75rem 1.5rem', background: '#e44d26', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;  