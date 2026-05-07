import React from 'react';
import Image from 'next/image';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <Image
          src="/about_hero_bg.png"
          alt="Professionals collaborating in an interview"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div className={styles.heroOverlay} />
        <h1 className={styles.heroTitle}>Disrupting The Way Hiring Works</h1>
      </section>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Who we are</h2>
          <p className={styles.sectionText}>
            We are Karnam, a forward-thinking platform built to revolutionize the hiring landscape.
            Born out of the frustration with traditional, resume-heavy recruitment cycles, our team of innovators
            set out to create a system that prioritizes actual problem-solving over keyword matching. We bridge the gap
            between talented, experienced professionals and hiring managers looking for genuine expertise.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our mission</h2>
          <p className={styles.sectionText}>
            Our mission is simple: to make hiring seamless, transparent, and strictly merit-based. We believe that
            a professional's worth is defined by their impact and the problems they can solve, not just the names
            on their CV. We are dedicated to empowering both candidates and employers by fostering meaningful connections
            that drive businesses forward.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How we are improving hiring</h2>
          <p className={styles.sectionText}>
            We are flipping the script by introducing a "Problem Statement" driven approach.
            Instead of submitting static resumes, professionals define themselves by the complex challenges they have overcome.
            Our proprietary AI matching engine deeply analyzes these experiences to ensure that hiring managers only see
            candidates who are perfectly aligned with their immediate operational needs. It's faster, smarter, and infinitely more effective.
          </p>
        </section>
      </div>
    </div>
  );
}
