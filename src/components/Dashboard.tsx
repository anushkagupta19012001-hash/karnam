import React from 'react';
import styles from './Dashboard.module.css';

interface DashboardProps {
  type: 'experienced' | 'hiring';
}

export default function Dashboard({ type }: DashboardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome to your Karnam Dashboard</h2>
        <p className={styles.subtitle}>
          {type === 'experienced' 
            ? 'Your profile is active. Here are some opportunities matching your validated experience.'
            : 'Your requirement is live. Here are professionals who have solved similar problems.'}
        </p>
      </div>

      <div className={styles.grid}>
        {[1, 2, 3].map((item) => (
          <div key={item} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}></div>
              <div>
                <h3 className={styles.matchTitle}>
                  {type === 'experienced' ? 'Senior Product Manager' : 'Alex D. - Product Leader'}
                </h3>
                <p className={styles.matchSubtitle}>
                  {type === 'experienced' ? 'Growth Stage Fintech' : '9 years experience'}
                </p>
              </div>
            </div>
            <div className={styles.matchScore}>92% Match</div>
            <p className={styles.matchReason}>
              {type === 'experienced' 
                ? 'Matches your experience in leading 0-1 product launches and scaling user acquisition.'
                : 'Has successfully scaled similar operations from 10k to 1M users.'}
            </p>
            <button className={styles.connectBtn}>Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
}
