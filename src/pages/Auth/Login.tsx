import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import styles from './Auth.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>      
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Enter your credentials to access your dashboard</p>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Email Address</label>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={18} />
            <input 
              type="email" 
              className={styles.input} 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Password</label>
            <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} size={18} />
            <input 
              type="password" 
              className={styles.input} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <Loader2 className={styles.spin} size={20} /> : 'Sign In'}
        </button>
      </form>

      <p className={styles.footerText}>
        Don't have an account? <Link to="/register" className={styles.link}>Create one now</Link>
      </p>
    </div>
  );
};

export default Login;
