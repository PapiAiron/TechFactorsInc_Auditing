import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../../pages/Auth/Auth.module.css';
import PageTransition from './PageTransition';

const AuthLayout: React.FC = () => {
  return (
    <div className={styles.authPage}>
      {/* Top Left Section - Logo and Tagline */}
      <div className={styles.topLeftSection}>
        <div className={styles.logo}>
          <img src='/src/public/img/logo.png' className={styles.imgLogo}></img>
          <span className={styles.logoTech}>tech</span>
          <span className={styles.logoFactors}>Factors</span>
          <span className={styles.logoInc}>Inc</span>
        </div>
        <p className={styles.tagline}>Making Learning a Great Experience</p>
      </div>

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
