import React from 'react';
import styles from './FlowView.module.css';

interface Props {
  onCreateProfile: () => void;
}

export default function HiringManagerView({ onCreateProfile }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Hiring Managers</h2>
        <p className={styles.tagline}>
          Hire those who have solved it before!
          <br />
          <span className={styles.subTagline}>
            Karnam helps you identify and engage people who have already solved problems similar to yours, so decisions are grounded in real outcomes, not resume based assumptions.
          </span>
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Now v/s Then</h3>
        <div className={styles.comparisonGrid}>
          <div className={styles.thenCard}>
            <h4 className={styles.cardTitle}>Then (Existing Hiring Journey)</h4>
            <ul className={styles.list}>
              <li>Large volumes of applications with low relevance</li>
              <li>Heavy reliance on resumes, interviews, and referrals</li>
              <li>Long hiring cycles with uncertain outcomes</li>
            </ul>
          </div>
          <div className={styles.nowCard}>
            <h4 className={styles.cardTitle}>Now (With Karnam)</h4>
            <ul className={styles.list}>
              <li>Start with defining the problem, not the role or title</li>
              <li>See people who've already handled similar situations</li>
              <li>Connect and evaluate based on demonstrated outcomes, not claims</li>
            </ul>
          </div>
        </div>
        <p className={styles.closingStatement}>
          Give me 1000 people who might have similar job title<br />
          <strong>Karnam focuses on:</strong> Give me 25 people who have proven experience in solving my problem. This shift reduces guesswork and improves decision quality.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>How it works</h3>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <p>Clearly define the problem, context, and expected outcome (Not more than 15 minutes, promise)</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <p>We identify individuals with comparable, proven work record (outcome based)</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <p>Connect with the highly relevant people and take it forward for hiring</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>4</div>
            <p>Get periodic insights on how your priorities compare with talent pools in the market</p>
          </div>
        </div>
        <p className={styles.callout}>For the first 50 we work with, there's no cost for lifetime, just a chance to build this together!</p>
      </div>

      <div className={styles.actionContainer}>
        <button className={styles.primaryButton} onClick={onCreateProfile}>
          Create Profile
        </button>
      </div>
    </div>
  );
}
