import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: '50px', height: '50px', border: '5px solid #f0f0f0', borderTopColor: '#e96c4c', borderRadius: '50%' }}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: '1100px', margin: '2rem auto', padding: '2rem' }}
    >
      {/* Back button */}
      <motion.button
        whileHover={{ x: -4 }}
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', fontSize: '1rem', color: '#666', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        ← Back to Products
      </motion.button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'}
            alt={product.name}
            style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }}>
            {product.category}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e96c4c' }}>${product.price}</span>
            <span style={{ background: product.stock > 0 ? '#d4edda' : '#f8d7da', color: product.stock > 0 ? '#155724' : '#721c24', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '2rem', fontSize: '1rem' }}>
            {product.description}
          </p>

          {/* Quantity selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Quantity:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8f9fa', borderRadius: '12px', padding: '0.5rem 1rem' }}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#333', width: '28px', height: '28px' }}
              >
                −
              </motion.button>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem', minWidth: '24px', textAlign: 'center' }}>{qty}</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#333', width: '28px', height: '28px' }}
              >
                +
              </motion.button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                flex: 1,
                padding: '1rem',
                background: added ? '#27ae60' : 'linear-gradient(135deg, #e96c4c, #f0a500)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { handleAddToCart(); navigate('/cart'); }}
              style={{ flex: 1, padding: '1rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Buy Now →
            </motion.button>
          </div>

          {/* Features */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['Free Shipping', 'Easy Returns', 'Secure Payment'].map(f => (
              <span key={f} style={{ background: '#f8f9fa', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#666' }}>
                ✓ {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;