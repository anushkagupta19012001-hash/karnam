"use client";

import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { supabase } from '@/lib/supabaseClient';

export default function ProfessionalDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('experienced_professionals')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        
        // Fetch Connection Requests
        const { data: matchesData } = await supabase
          .from('matches')
          .select('*')
          .eq('email_ep', profileData.email);
          
        if (matchesData) {
          setRequests(matchesData);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (matchId: string, status: 'accepted' | 'rejected') => {
    try {
      await supabase
        .from('matches')
        .update({ ep_status: status })
        .eq('id', matchId);
      
      // Refresh local state
      setRequests(requests.map(req => req.id === matchId ? { ...req, ep_status: status } : req));
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;
  if (!profile) return <div className={styles.loading}>Profile not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Welcome, {profile.full_name}</h1>
        <button className={styles.editBtn}>Edit Profile</button>
      </div>

      <div className={styles.profileSummary}>
        <h3>Profile Overview</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{profile.email}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Phone</span>
            <span className={styles.value}>{profile.phone}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Location</span>
            <span className={styles.value}>{profile.preferences?.city || 'N/A'}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Projects</span>
            <span className={styles.value}>{profile.projects?.length || 0} documented</span>
          </div>
        </div>
      </div>

      <div className={styles.requestsSection}>
        <h3>Connection Requests</h3>
        {requests.length === 0 ? (
          <p className={styles.emptyState}>No connection requests yet.</p>
        ) : (
          <div className={styles.requestList}>
            {requests.map(req => (
              <div key={req.id} className={styles.requestCard}>
                <div className={styles.requestInfo}>
                  <h4>{req.title}</h4>
                  <p className={styles.problemStatement}><strong>Problem Statement:</strong> {req.problem_statement}</p>
                  
                  <div className={styles.statusBadge}>
                    Your Status: <span className={styles[req.ep_status]}>{req.ep_status.toUpperCase()}</span>
                  </div>
                </div>
                
                {req.ep_status === 'pending' && (
                  <div className={styles.requestActions}>
                    <button onClick={() => updateStatus(req.id, 'accepted')} className={styles.acceptBtn}>Accept</button>
                    <button onClick={() => updateStatus(req.id, 'rejected')} className={styles.rejectBtn}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
