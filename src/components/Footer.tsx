import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h4 className={styles.heading}>Contact</h4>
          <ul className={styles.list}>
            <li><a href="mailto:support@karnam.com">support@karnam.com</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.heading}>Address</h4>
          <p className={styles.address}>
            Karnam HQ<br />
            123 Innovation Drive<br />
            Tech District, CA 94043
          </p>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Karnam. All rights reserved.
      </div>
    </footer>
  );
}
