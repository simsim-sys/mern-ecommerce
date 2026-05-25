import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
        })),
        shippingAddress: form,
        totalPrice: total,
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError('Failed to place order, try again');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <h1>Checkout</h1>

      {/* Order Summary */}
      <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Order Summary</h3>
        {cart.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span>{item.name} x {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #ddd', marginTop: '0.5rem', paddingTop: '0.5rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Form */}
      <h3>Shipping Address</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={e => setForm({ ...form, postalCode: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={form.country}
          onChange={e => setForm({ ...form, country: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '1rem', background: '#e44d26', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', marginTop: '0.5rem' }}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;