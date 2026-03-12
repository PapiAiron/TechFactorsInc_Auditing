import React from 'react';
import { BookOpen, Lightbulb, Zap, Users } from 'lucide-react';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <img 
              src="/src/public/img/logo.png" 
              alt="techFactors Logo" 
              className={styles.logo}
            />
          </div>
          <h1 className={styles.title}>About techFactors</h1>
        </div>

        <div className={styles.content}>
          {/* Purpose Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <BookOpen size={20} />
              Our Purpose
            </h2>
            <p className={styles.bodyText}>
              techFactors Inc. is dedicated to empowering organizations with cutting-edge IT asset management solutions. 
              Our platform streamlines the tracking, auditing, and management of technological resources—enabling 
              staff and employees to operate more efficiently and effectively.
            </p>
          </section>

          {/* Core Values */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Zap size={20} />
              Core Values
            </h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <Lightbulb size={24} className={styles.valueIcon} />
                <h3>Operational Excellence</h3>
                <p>We strive to deliver tools that enhance workplace productivity and simplify complex asset management workflows.</p>
              </div>
              <div className={styles.valueCard}>
                <Zap size={24} className={styles.valueIcon} />
                <h3>Collaborative Innovation</h3>
                <p>We believe the best solutions come from understanding the daily challenges faced by our staff and employees.</p>
              </div>
              <div className={styles.valueCard}>
                <Users size={24} className={styles.valueIcon} />
                <h3>Workforce Empowerment</h3>
                <p>We are committed to providing every team member with the tools they need to succeed in their roles.</p>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Lightbulb size={20} />
              Our Mission
            </h2>
            <p className={styles.bodyText}>
              To transform how organizations manage their IT infrastructure by delivering intuitive, powerful tools 
              that your team will actually want to use. We aim to eliminate spreadsheets and manual tracking
              replacing them with automation and real-time insights that empower your workforce.
            </p>
          </section>

          {/* Meet the Team Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Users size={20} />
              Meet the Team
            </h2>

            {/* Supervisor */}
            <div className={styles.supervisorArea}>
              <div className={`${styles.profileCard} ${styles.supervisor}`}>
                <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' }}>
                  <span>FD</span>
                </div>
                <h3 className={styles.profileName}>Mr. Franz Dave Irinco</h3>
                <p className={styles.profileRole}>Immediate Supervisor</p>
                <p className={styles.profileDesc}> - </p>
              </div>
            </div>

            {/* Student Interns Label */}
            <div className={styles.internsLabel}>
              <span>Student Interns from Laguna University - BS in Computer Science - Data Science A.Y. 2025-2026</span>
            </div>

            {/* Proponents */}
            <div className={styles.teamGrid}>
              <div className={styles.profileCard}>
                <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                  <span>MA</span>
                </div>
                <h3 className={styles.profileName}>Marc Airon Cantal</h3>
                <p className={styles.profileRole}>Lead Developer</p>
                <p className={styles.profileDesc}>Full-stack Implementation</p>
              </div>
              <div className={styles.profileCard}>
                <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <span>RS</span>
                </div>
                <h3 className={styles.profileName}>Richard Sean Salabsab</h3>
                <p className={styles.profileRole}>UI/UX Designer</p>
                <p className={styles.profileDesc}>Interface & Experience Design</p>
              </div>
              <div className={styles.profileCard}>
                <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
                  <span>GM</span>
                </div>
                <h3 className={styles.profileName}>Giro Mangalindan</h3>
                <p className={styles.profileRole}>Research Proponent</p>
                <p className={styles.profileDesc}>Documentation & Research</p>
              </div>
              <div className={styles.profileCard}>
                <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <span>JC</span>
                </div>
                <h3 className={styles.profileName}>Jasper Canaling</h3>
                <p className={styles.profileRole}>Research Proponent</p>
                <p className={styles.profileDesc}>Documentation & Research</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
