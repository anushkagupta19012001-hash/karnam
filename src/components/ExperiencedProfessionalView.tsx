import React from 'react';
import styles from './FlowView.module.css';

interface Props {
  onCreateProfile: () => void;
}

export default function ExperiencedProfessionalView({ onCreateProfile }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Experienced Professional</h2>
        <p className={styles.tagline}>
          Get hired for what you've actually done.
          <br />
          <span className={styles.subTagline}>
            Karnam helps you connect with the right opportunities based on your proven experience and the value you can create, not just your title or resume.
          </span>
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Now v/s Then</h3>
        <div className={styles.comparisonGrid}>
          <div className={styles.thenCard}>
            <h4 className={styles.cardTitle}>Then (Existing Journey)</h4>
            <ul className={styles.list}>
              <li>Time consuming mass job applications with no response.</li>
              <li>Limited access to the right networks and referrals.</li>
              <li>Roles vaguely matched based on your title and brief resume.</li>
            </ul>
          </div>
          <div className={styles.nowCard}>
            <h4 className={styles.cardTitle}>Now (With Karnam)</h4>
            <ul className={styles.list}>
              <li>Connect with hiring managers (decision makers) directly.</li>
              <li>Solve their problems where you have already demonstrated outcomes.</li>
              <li>With no application effort, we will connect you with them automatically.</li>
            </ul>
          </div>
        </div>
        <p className={styles.closingStatement}>
          What got you your last job - applications, resumes, referrals, won't get you your next one! This is only for those with 4+ years of experience.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>How it works</h3>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <p>Create a detailed profile on our platform (Not more than 15 minutes, promise).</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <p>We validate your experience to ensure credibility.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <p>Get connection requests automatically with exact role requirements.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>4</div>
            <p>Get periodic insights on how your experience compares to existing market needs.</p>
          </div>
        </div>
        <p className={styles.callout}>We do not charge anything from you!</p>
      </div>

      <div className={styles.actionContainer}>
        <button className={styles.primaryButton} onClick={onCreateProfile}>
          Create Profile
        </button>
      </div>
    </div>
  );
}
