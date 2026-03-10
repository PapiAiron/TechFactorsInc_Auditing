import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, QrCode, BarChart3, ArrowRight } from 'lucide-react';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      <header className={styles.header}>
        <div className={styles.logo}>
           <img src='/src/public/img/logo.png' className={styles.imgLogo}></img>
          <span className={styles.logoTech}>tech</span>
          <span className={styles.logoFactors}>Factors</span>
          <span className={styles.logoInc}>Inc</span>
        </div>
        <div className={styles.authButtons}>
          <button className={styles.loginBtn} onClick={() => navigate('/login')}>Login</button>
          <button className={styles.registerBtn} onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Enterprise IT Auditing <br />
            <span className={styles.accent}>Simplified.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id, saepe animi? Quis ipsa placeat consequuntur enim eius. Maiores, quibusdam omnis? Necessitatibus provident illo, dolores aliquid quidem cumque aspernatur ex fuga!
          </p>
          <div className={styles.ctaGroup}>
            <button className={styles.getStartedBtn} onClick={() => navigate('/register')}>
              Get Started <ArrowRight size={20} />
            </button>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><QrCode size={32} /></div>
            <h3>Smart Scanning</h3>
            <p>Scan asset tags and barcodes directly from your mobile device or browser.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><ShieldCheck size={32} /></div>
            <h3>Compliance Ready</h3>
            <p>Ensure your infrastructure meets all regulatory and security standards.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><BarChart3 size={32} /></div>
            <h3>Deep Analytics</h3>
            <p>Generate comprehensive reports on asset utilization and audit history.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 TechFactors Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
