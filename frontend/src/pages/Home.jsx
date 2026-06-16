import { useEffect, useState } from 'react';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
        >
          Welcome to <span style={{ background: 'linear-gradient(90deg, #e96c4c, #f0a500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MERN Shop</span>
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '2rem' }}
        >
          Discover amazing products at great prices
        </motion.p>
        <motion.input
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          type="text"
          placeholder=" Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '500px', padding: '1rem 1.5rem', borderRadius: '30px', border: 'none', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
        />
      </motion.div>

      {/* Products */}
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{filtered.length} Products {search && `for "${search}"`}</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTopColor: '#e96c4c', borderRadius: '50%', margin: '0 auto' }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
            <p style={{ fontSize: '3rem' }}></p>
            <p style={{ fontSize: '1.2rem' }}>No products found</p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;