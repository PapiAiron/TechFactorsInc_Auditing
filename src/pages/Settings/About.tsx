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
              src="/img/logo.png" 
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
              techFactors is dedicated to bridging the gap between technology and practical learning. 
              Our platform is designed to streamline the management of educational resources, student 
              progress, and technical modules—making learning a great experience for everyone.
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
                <h3>Innovation in Education</h3>
                <p>We continuously seek new ways to make learning more engaging and effective through technology.</p>
              </div>
              <div className={styles.valueCard}>
                <Zap size={24} className={styles.valueIcon} />
                <h3>Practical Application</h3>
                <p>We believe technology is best appreciated when applied to real-world challenges and scenarios.</p>
              </div>
              <div className={styles.valueCard}>
                <Users size={24} className={styles.valueIcon} />
                <h3>Seamless Accessibility</h3>
                <p>We ensure everyone can access our platform anytime, anywhere, on any device.</p>
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
              To empower students through high-quality courseware and instructional materials 
              that make learning an enjoyable journey. We strive to create an ecosystem where 
              technology enhances education without overwhelming it.
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
