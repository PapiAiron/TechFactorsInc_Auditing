import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from '../../pages/Auth/Auth.module.css';
import PageTransition from './PageTransition';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  
  // Determine page indicator based on current route
  const getPageIndicator = () => {
    switch (location.pathname) {
      case '/login':
        return 'Sign In';
      case '/register':
        return 'SIGN UP';
      case '/forgot-password':
        return 'FORGOT PASSWORD';
      default:
        return 'LOG IN';
    }
  };

  return (
    <div className={styles.authPage}>
      {/* Responsive Top Bar */}
      <header className={styles.authTopBar}>
        <div className={styles.topBarLeft}>
          <Link to="/" className={styles.backBtn} aria-label="Go Back">
            <ArrowLeft size={20} />
          </Link>
          <div className={styles.branding}>
           <div className={styles.logoTitleRow}>
                <img src='/img/logo.png' alt="Logo" className={styles.miniLogo} />
               <span className={styles.logoText}>
                 tech<span className={styles.logoFactors}>Factors</span> Inc.
               </span>
             </div>
            <p className={styles.tagline}>Making Learning a Great Experience</p>
          </div>
        </div>
        
        <div className={styles.topBarRight}>
          <span className={styles.pageIndicator}>{getPageIndicator()}</span>
        </div>
      </header>

      {/* Transitioning Content */}
      <PageTransition>
        <Outlet />
      </PageTransition>

      {/* Bottom Left Section - Mission and Vision */}
      <div className={styles.bottomLeftSection}>
        <div className={styles.missionVision}>
          <h3>Mission</h3>
          <p>With TechFactors’ courseware, students are given the opportunity to appreciate the practical use of technology through modules, programs, workbooks, worksheets, instructional materials, teaching aids, and testing materials.</p>
        </div>
        <div className={styles.missionVision}>
          <h3>Vision</h3>
          <p>With TechFactors’ courseware, students are given the opportunity to appreciate the practical use of technology through modules, programs, workbooks, worksheets, instructional materials, teaching aids, and testing materials.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
