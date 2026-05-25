import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const statusColor = (bool) => bool
  ? { bg: '#d4f5e9', color: '#1a7a4a', label: bool }
  : { bg: '#fff0eb', color: '#c0392b', label: bool };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/mine')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: '48px', height: '48px', border: '5px solid #f0f0f0', borderTopColor: '#e96c4c', borderRadius: '50%' }}
      />
    </div>
  );

  if (orders.length === 0) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ fontSize: '5rem', marginBottom: '1rem' }}>📦</motion.div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>No orders yet</h2>
      <p style={{ color: '#999' }}>Your order history will appear here</p>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>My Orders</h1>
      <p style={{ color: '#999', marginBottom: '2rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      <AnimatePresence>
        {orders.map((order, i) => (
          <motion.div key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ background: 'white', borderRadius: '20px', marginBottom: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

            {/* Header row */}
            <div
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#aaa', marginBottom: '0.2rem' }}>
                  ORDER #{order._id.slice(-8).toUpperCase()}
                </p>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · <span style={{ color: '#e96c4c' }}>${order.totalPrice.toFixed(2)}</span>
                </p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#bbb' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                <span style={{ background: order.isPaid ? '#d4f5e9' : '#fff0eb', color: order.isPaid ? '#1a7a4a' : '#c0392b', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                  {order.isPaid ? '✓ Paid' : '⏳ Unpaid'}
                </span>
                <span style={{ background: order.isDelivered ? '#d4f5e9' : '#fff8e1', color: order.isDelivered ? '#1a7a4a' : '#b8860b', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                  {order.isDelivered ? '✓ Delivered' : '🚚 Processing'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#bbb', marginTop: '0.2rem' }}>
                  {expanded === order._id ? '▲ Hide' : '▼ Details'}
                </span>
              </div>
            </div>

            {/* Expandable items */}
            <AnimatePresence>
              {expanded === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}>
                  <div style={{ borderTop: '1px solid #f5f5f5', padding: '1.25rem 1.5rem' }}>
                    <p style={{ fontWeight: '700', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#555' }}>Items</p>
                    {order.items.map((item, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <img src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'}
                          alt={item.name}
                          style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '10px' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</p>
                          <p style={{ margin: 0, color: '#aaa', fontSize: '0.8rem' }}>Qty: {item.qty}</p>
                        </div>
                        <span style={{ fontWeight: '700', color: '#e96c4c' }}>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}

                    {order.shippingAddress && (
                      <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '0.85rem 1rem', marginTop: '0.75rem' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#888', fontWeight: '600' }}>📍 Shipping to</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#444' }}>
                          {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default Orders;