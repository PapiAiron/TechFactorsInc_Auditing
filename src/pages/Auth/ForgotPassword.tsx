import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import styles from './Auth.module.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/login" className={styles.backToLoginBtn}>
          <ArrowLeft size={18} />
          <span>Back to Login</span>
        </Link>
      </div>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Enter your email to receive a password reset link</p>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={styles.successBox}>
          <CheckCircle2 size={18} />
          <span>Reset link sent! Please check your inbox.</span>
        </div>
      )}

      {!success ? (
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 className={styles.spin} size={20} /> : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        <div className={styles.successActions}>
          <Link to="/login" className={styles.backToLoginBtn}>
            <ArrowLeft size={18} />
            <span>Back to Login</span>
          </Link>
        </div>
      )}

      {!success && (
        <p className={styles.footerText}>
          Remembered your password? <Link to="/login" className={styles.link}>Sign In</Link>
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
