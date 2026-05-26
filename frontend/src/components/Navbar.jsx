import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [logoHovered, setLogoHovered] = useState(false);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Logo */}
      <motion.div
        onHoverStart={() => setLogoHovered(true)}
        onHoverEnd={() => setLogoHovered(false)}
        whileHover={{ scale: 1.05 }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <motion.span
            animate={{ rotate: logoHovered ? [0, -10, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '1.8rem' }}
          >
            🛒
          </motion.span>
          <motion.span
            animate={{
              background: logoHovered
                ? ['linear-gradient(90deg, #e96c4c, #f0a500)', 'linear-gradient(90deg, #f0a500, #e96c4c)']
                : 'linear-gradient(90deg, #e96c4c, #f0a500)',
            }}
            style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #e96c4c, #f0a500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
            }}
          >
            MERN Shop
          </motion.span>
        </Link>
      </motion.div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <motion.div whileHover={{ y: -2 }}>
          <Link to="/" style={{ color: '#ccc', fontWeight: '500', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = '#ccc'}
          >
            Home
          </Link>
        </motion.div>

        {/* Cart */}
        <motion.div whileHover={{ y: -2 }}>
          <Link to="/cart" style={{ color: '#ccc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = '#ccc'}
          >
            🛍️ Cart
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ background: '#e96c4c', color: 'white', borderRadius: '50%', padding: '0.1rem 0.45rem', fontSize: '0.75rem', fontWeight: 'bold' }}
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
        </motion.div>

        {user ? (
          <>
            {/* Admin or Sell link */}
            {user.role === 'admin' ? (
              <motion.div whileHover={{ y: -2 }}>
                <Link to="/admin" style={{ color: '#f0a500', fontWeight: 'bold' }}>⚙️ Admin</Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ y: -2 }}>
                <Link to="/admin" style={{ color: '#2ecc71', fontWeight: 'bold' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = '#2ecc71'}
                >
                  🛍️ Sell
                </Link>
              </motion.div>
            )}

            <motion.div whileHover={{ y: -2 }}>
              <Link to="/orders" style={{ color: '#ccc' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = '#ccc'}
              >
                📦 Orders
              </Link>
            </motion.div>

            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Hi, {user.name} 👋</span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{ background: 'linear-gradient(135deg, #e96c4c, #c0392b)', color: 'white', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <motion.div whileHover={{ y: -2 }}>
              <Link to="/login" style={{ color: '#ccc' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = '#ccc'}
              >
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" style={{ background: 'linear-gradient(135deg, #e96c4c, #f0a500)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: 'bold' }}>
                Register
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;