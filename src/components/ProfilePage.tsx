import React from 'react';

interface ProfilePageProps {
  user: { id: string; email: string; type: string } | null;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const username = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <div style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-slate-dark)' }}>
        User Profile
      </h1>
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Hi {username},</h2>
            <p style={{ color: 'var(--color-slate-light)', margin: '0.25rem 0 0 0' }}>{user?.email}</p>
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Account Details</h3>
          <p><strong>Account Type:</strong> {user?.type === 'professional' ? 'Experienced Professional' : 'Hiring Manager'}</p>
          <p><strong>Status:</strong> Active</p>
        </div>
      </div>
    </div>
  );
}
