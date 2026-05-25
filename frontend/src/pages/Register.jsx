import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data);
      navigate('/');
    } catch (err) {
      setError('Registration failed, try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Create Account 🚀</h2>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '2rem' }}>Join MERN Shop today</p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#ffe0e0', color: '#c0392b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            style={{ width: '100%', padding: '0.85rem 1rem', marginBottom: '1rem', border: '2px solid #eee', borderRadius: '10px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#e96c4c'}
            onBlur={e => e.target.style.borderColor = '#eee'}
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            style={{ width: '100%', padding: '0.85rem 1rem', marginBottom: '1rem', border: '2px solid #eee', borderRadius: '10px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#e96c4c'}
            onBlur={e => e.target.style.borderColor = '#eee'}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            style={{ width: '100%', padding: '0.85rem 1rem', marginBottom: '1.5rem', border: '2px solid #eee', borderRadius: '10px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#e96c4c'}
            onBlur={e => e.target.style.borderColor = '#eee'}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #e96c4c, #f0a500)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#999' }}>
          Have an account? <Link to="/login" style={{ color: '#e96c4c', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;