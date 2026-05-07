import React from 'react';
import Image from 'next/image';
import styles from './Header.module.css';

import ProfileDropdown, { UserProfile } from './ProfileDropdown';

interface HeaderProps {
  onNavClick: (view: 'home' | 'experienced' | 'hiring' | 'about') => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  userProfile?: UserProfile | null;
  onLogout: () => void;
  onViewProfile: () => void;
  onSettings: () => void;
  onUnauthenticatedIconClick: () => void;
}

export default function Header({ 
  onNavClick, 
  onLoginClick, 
  isLoggedIn, 
  userProfile, 
  onLogout,
  onViewProfile,
  onSettings,
  onUnauthenticatedIconClick
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => onNavClick('home')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', overflow: 'hidden', width: '140px', height: '45px', justifyContent: 'center' }}>
          <Image
            src="/logo.png"
            alt="Karnam Logo"
            width={240}
            height={80}
            style={{ objectFit: 'cover', transform: 'scale(1.4)' }}
            priority
          />
        </div>
        <nav className={styles.nav}>
          <button onClick={() => onNavClick('home')} className={styles.navLink}>Home</button>
          <button onClick={() => onNavClick('about')} className={styles.navLink}>About</button>
          {!isLoggedIn && (
            <button onClick={onLoginClick} className={styles.loginBtn}>Log In</button>
          )}
          <ProfileDropdown
            isLoggedIn={isLoggedIn}
            userProfile={userProfile}
            onUnauthenticatedClick={onUnauthenticatedIconClick}
            onViewProfile={onViewProfile}
            onSettings={onSettings}
            onLogout={onLogout}
          />
        </nav>
      </div>
    </header>
  );
}
