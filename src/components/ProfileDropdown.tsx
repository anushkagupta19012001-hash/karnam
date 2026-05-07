import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProfileDropdown.module.css';

export interface UserProfile {
  name?: string;
  company?: string;
  experience?: string;
  imageUrl?: string;
}

interface ProfileDropdownProps {
  isLoggedIn: boolean;
  userProfile?: UserProfile | null;
  onUnauthenticatedClick: () => void;
  onViewProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({
  isLoggedIn,
  userProfile,
  onUnauthenticatedClick,
  onViewProfile,
  onSettings,
  onLogout,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAvatarClick = () => {
    if (!isLoggedIn) {
      onUnauthenticatedClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button 
        className={styles.avatarBtn} 
        onClick={handleAvatarClick}
        aria-label="User Profile"
        aria-expanded={isOpen}
      >
        {isLoggedIn ? (
          userProfile?.imageUrl ? (
            <Image 
              src={userProfile.imageUrl} 
              alt="Profile Avatar" 
              width={40} 
              height={40} 
              className={styles.avatarImage} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
            </div>
          )
        ) : (
          <svg className={styles.defaultAvatar} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {isOpen && isLoggedIn && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          
          <div className={styles.dropdown}>
            <div className={styles.userInfo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '12px' }}>
                {userProfile?.imageUrl ? (
                  <Image 
                    src={userProfile.imageUrl} 
                    alt="Profile Avatar" 
                    width={60} 
                    height={60} 
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className={styles.userName}>Hi {userProfile?.name || 'User'},</div>
              
              {((userProfile?.company && userProfile.company !== 'N/A') || (userProfile?.experience && userProfile.experience !== 'N/A')) && (
                <div className={styles.userDetails}>
                  {[userProfile?.company, userProfile?.experience].filter(val => val && val !== 'N/A').join(' • ')}
                </div>
              )}
            </div>
            
            <ul className={styles.menuList}>
              <li>
                <button className={styles.menuItem} onClick={() => handleAction(onViewProfile)}>
                  View Profile
                </button>
              </li>
              <li>
                <button className={styles.menuItem} onClick={() => handleAction(onSettings)}>
                  Settings
                </button>
              </li>
              <li>
                <button className={`${styles.menuItem} ${styles.logoutItem}`} onClick={() => handleAction(onLogout)}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
