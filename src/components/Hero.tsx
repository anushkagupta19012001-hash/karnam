import React from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  onSelectFlow: (flow: 'experienced' | 'hiring') => void;
}

export default function Hero({ onSelectFlow }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Karnam seamlessly connects problems with the people best suited to solve them, based on what they've already demonstrated!
        </h1>
        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={() => onSelectFlow('experienced')}
          >
            Experienced Professional
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => onSelectFlow('hiring')}
          >
            Hiring Manager
          </button>
        </div>
      </div>
    </section>
  );
}
