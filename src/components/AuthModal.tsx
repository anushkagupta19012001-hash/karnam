"use client";

import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userType: 'professional' | 'manager', userId: string) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<'professional' | 'manager'>('professional');
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Password reset link sent to your email.' });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user) {
          // Verify they exist in the correct table
          const tableName = activeTab === 'professional' ? 'experienced_professionals' : 'hiring_managers';
          const { data: profile, error: profileError } = await supabase
            .from(tableName)
            .select('id')
            .eq('user_id', data.user.id)
            .single();

          if (profileError || !profile) {
            // Signed in but wrong account type
            await supabase.auth.signOut();
            throw new Error(`Account not found for ${activeTab === 'professional' ? 'Experienced Professional' : 'Hiring Manager'}.`);
          }

          onSuccess(activeTab, data.user.id);
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.header}>
          <h2>{mode === 'login' ? 'Welcome Back' : 'Reset Password'}</h2>
          <p>{mode === 'login' ? 'Log in to your Karnam account' : 'Enter your email to receive a reset link'}</p>
        </div>

        {mode === 'login' && (
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'professional' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('professional')}
              type="button"
            >
              Professional
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'manager' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('manager')}
              type="button"
            >
              Hiring Manager
            </button>
          </div>
        )}

        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          {mode === 'login' && (
            <div className={styles.field}>
              <div className={styles.passwordHeader}>
                <label>Password</label>
                <button 
                  type="button" 
                  className={styles.textBtn}
                  onClick={() => setMode('forgot')}
                >
                  Forgot?
                </button>
              </div>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Send Reset Link'}
          </button>
          
          {mode === 'forgot' && (
            <button 
              type="button" 
              className={styles.backBtn}
              onClick={() => setMode('login')}
            >
              Back to Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
