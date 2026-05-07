"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ExperiencedProfessionalView from '@/components/ExperiencedProfessionalView';
import HiringManagerView from '@/components/HiringManagerView';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabaseClient';

import HiringManagerForm from '@/components/HiringManagerForm';
import ExperiencedProfessionalForm from '@/components/ExperiencedProfessionalForm';
import ProfessionalDashboard from '@/components/ProfessionalDashboard';
import ManagerDashboard from '@/components/ManagerDashboard';
import Toast from '@/components/Toast';
import ProfilePage from '@/components/ProfilePage';
import AboutPage from '@/components/AboutPage';

type ViewState = 'home' | 'experienced' | 'hiring' | 'form_experienced' | 'form_hiring' | 'dashboard_experienced' | 'dashboard_hiring' | 'profile' | 'about';

export default function Home() {
  const [view, setView] = useState<ViewState>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ id: string, email: string, type: 'professional' | 'manager' } | null>(null);

  const [hiringData, setHiringData] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Need to identify user type (this is simplified, ideally store type in user metadata)
        setUser({ id: session.user.id, email: session.user.email || '', type: 'professional' });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setView('home');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('You have been logged out successfully.');
  };

  const handleLoginSuccess = (type: 'professional' | 'manager', userId: string) => {
    setIsAuthOpen(false);
    setUser({ id: userId, email: '', type }); // email fetched separately or omitted
    setView(type === 'professional' ? 'dashboard_experienced' : 'dashboard_hiring');
  };

  const handleNavClick = (newView: 'home' | 'experienced' | 'hiring' | 'about') => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateProfileExperienced = () => {
    setView('form_experienced');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateProfileHiring = () => {
    setView('form_hiring');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExperiencedFormSubmit = () => {
    setView('dashboard_experienced');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHiringFormSubmit = () => {
    setView('dashboard_hiring');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        onNavClick={handleNavClick} 
        onLoginClick={() => setIsAuthOpen(true)}
        isLoggedIn={!!user}
        userProfile={{ name: user?.email?.split('@')[0], company: 'N/A', experience: 'N/A' }}
        onLogout={handleLogout}
        onViewProfile={() => { setView('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onSettings={() => handleNavClick('home')}
        onUnauthenticatedIconClick={() => showToast('Please log in to access your profile.')}
      />
      
      <main style={{ flex: 1 }}>
        {view === 'home' && (
          <>
            <Hero onSelectFlow={(flow) => setView(flow)} />
            <BlogSection />
          </>
        )}

        {view === 'about' && (
          <AboutPage />
        )}

        {view === 'experienced' && (
          <ExperiencedProfessionalView onCreateProfile={handleCreateProfileExperienced} />
        )}

        {view === 'hiring' && (
          <HiringManagerView onCreateProfile={handleCreateProfileHiring} />
        )}

        {view === 'form_experienced' && (
          <ExperiencedProfessionalForm onSubmitComplete={handleExperiencedFormSubmit} />
        )}

        {view === 'form_hiring' && (
          <HiringManagerForm onSubmitComplete={handleHiringFormSubmit} />
        )}

        {view === 'dashboard_experienced' && (
          <ProfessionalDashboard />
        )}

        {view === 'dashboard_hiring' && (
          <ManagerDashboard />
        )}

        {view === 'profile' && (
          <ProfilePage user={user} />
        )}
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleLoginSuccess}
      />

      <Toast 
        message={toastMessage} 
        isVisible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />
    </div>
  );
}
