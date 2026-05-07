"use client";

import React, { useState } from 'react';
import styles from './MultiStepForm.module.css';
import { supabase } from '@/lib/supabaseClient';

const SECTIONS = [
  'Basic Info', 'Role Basics', 'Problem Statement', 'Experience Requirement', 'Constraints', 'Review'
];

interface Props {
  onSubmitComplete: () => void;
}

export default function HiringManagerForm({ onSubmitComplete }: Props) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [basicInfo, setBasicInfo] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [roleBasics, setRoleBasics] = useState({ title: '', department: '', hiringType: 'New' });
  const [problemStatement, setProblemStatement] = useState({ businessContext: '', problemToSolve: '', whyNeeded: '', responsibilities: '', metrics: '' });
  const [experienceReq, setExperienceReq] = useState({ minYears: '', idealBackground: '' });
  const [constraints, setConstraints] = useState({ education: '', city: '', isRemote: false, mandatorySkills: '', maxCtc: '', noticePeriod: '30' });

  // Validation
  const validateSection = () => {
    if (currentSection === 0) {
      return basicInfo.fullName && basicInfo.email && basicInfo.password && basicInfo.phone;
    }
    if (currentSection === 1) {
      return roleBasics.title && roleBasics.hiringType;
    }
    if (currentSection === 2) {
      const respCount = problemStatement.responsibilities.split('\n').filter(r => r.trim()).length;
      const valid = 
        problemStatement.businessContext.length >= 40 &&
        problemStatement.problemToSolve.length >= 50 &&
        problemStatement.whyNeeded.length >= 40 &&
        respCount >= 3 &&
        problemStatement.metrics;
      if (!valid) setError('Please meet all minimum length requirements and provide at least 3 responsibilities.');
      return valid;
    }
    if (currentSection === 3) {
      return experienceReq.minYears !== '';
    }
    if (currentSection === 4) {
      return constraints.city && constraints.mandatorySkills && constraints.noticePeriod;
    }
    return true;
  };

  const nextSection = () => {
    setError(null);
    if (validateSection()) {
      setCurrentSection(prev => Math.min(prev + 1, SECTIONS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (!error) setError('Please fill all required fields correctly before proceeding.');
    }
  };

  const prevSection = () => {
    setError(null);
    setCurrentSection(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: basicInfo.email,
        password: basicInfo.password,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Failed to create user account.");

      const responsibilitiesArray = problemStatement.responsibilities.split('\n').filter(r => r.trim());

      // 2. Insert Profile
      const { error: profileError } = await supabase.from('hiring_managers').insert({
        user_id: userId,
        email: basicInfo.email,
        full_name: basicInfo.fullName,
        phone: basicInfo.phone,
        role_title: roleBasics.title,
        department: roleBasics.department,
        hiring_type: roleBasics.hiringType,
        business_context: problemStatement.businessContext,
        problem_to_solve: problemStatement.problemToSolve,
        why_role_needed: problemStatement.whyNeeded,
        key_responsibilities: responsibilitiesArray,
        success_metrics: problemStatement.metrics,
        min_years_experience: parseInt(experienceReq.minYears),
        ideal_background: experienceReq.idealBackground,
        education_requirement: constraints.education,
        location: constraints.isRemote ? 'Remote' : constraints.city,
        mandatory_skills: constraints.mandatorySkills,
        max_ctc: constraints.maxCtc ? parseInt(constraints.maxCtc) : null,
        notice_period: constraints.noticePeriod
      });

      if (profileError) throw profileError;

      // Log them in fully if not already
      await supabase.auth.signInWithPassword({ email: basicInfo.email, password: basicInfo.password });
      
      onSubmitComplete();

    } catch (err: any) {
      setError(err.message || 'Failed to submit profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className={styles.formGroup}>
            <div className={styles.field}>
              <label>Full Name *</label>
              <input type="text" value={basicInfo.fullName} onChange={e => setBasicInfo({...basicInfo, fullName: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Email *</label>
              <input type="email" value={basicInfo.email} onChange={e => setBasicInfo({...basicInfo, email: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Create Password *</label>
              <input type="password" value={basicInfo.password} onChange={e => setBasicInfo({...basicInfo, password: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Phone *</label>
              <input type="tel" value={basicInfo.phone} onChange={e => setBasicInfo({...basicInfo, phone: e.target.value})} required />
            </div>
          </div>
        );
      case 1:
        return (
          <div className={styles.formGroup}>
            <div className={styles.field}>
              <label>Role Title *</label>
              <input type="text" value={roleBasics.title} onChange={e => setRoleBasics({...roleBasics, title: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Department (Optional)</label>
              <input type="text" value={roleBasics.department} onChange={e => setRoleBasics({...roleBasics, department: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Hiring Type *</label>
              <select value={roleBasics.hiringType} onChange={e => setRoleBasics({...roleBasics, hiringType: e.target.value})}>
                <option value="New">New Role</option>
                <option value="Replacement">Replacement</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.formGroup}>
            <div className={styles.field}>
              <label>Business Context *</label>
              <span className={styles.helper}>Min 40 chars. What is the current state of the business?</span>
              <textarea value={problemStatement.businessContext} onChange={e => setProblemStatement({...problemStatement, businessContext: e.target.value})} />
              <span className={styles.charCount}>{problemStatement.businessContext.length}/40 min</span>
            </div>
            <div className={styles.field}>
              <label>Problem to Solve *</label>
              <span className={styles.helper}>Min 50 chars. What is the core issue this role will address?</span>
              <textarea value={problemStatement.problemToSolve} onChange={e => setProblemStatement({...problemStatement, problemToSolve: e.target.value})} />
              <span className={styles.charCount}>{problemStatement.problemToSolve.length}/50 min</span>
            </div>
            <div className={styles.field}>
              <label>Why this role is needed *</label>
              <span className={styles.helper}>Min 40 chars. Why can't the current team solve this?</span>
              <textarea value={problemStatement.whyNeeded} onChange={e => setProblemStatement({...problemStatement, whyNeeded: e.target.value})} />
              <span className={styles.charCount}>{problemStatement.whyNeeded.length}/40 min</span>
            </div>
            <div className={styles.field}>
              <label>Key Responsibilities *</label>
              <span className={styles.helper}>Enter one responsibility per line. Minimum 3.</span>
              <textarea value={problemStatement.responsibilities} onChange={e => setProblemStatement({...problemStatement, responsibilities: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Success Metrics *</label>
              <span className={styles.helper}>How will success be measured 6-12 months from now?</span>
              <textarea value={problemStatement.metrics} onChange={e => setProblemStatement({...problemStatement, metrics: e.target.value})} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.formGroup}>
            <div className={styles.field}>
              <label>Minimum Years of Experience *</label>
              <input type="number" value={experienceReq.minYears} onChange={e => setExperienceReq({...experienceReq, minYears: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Ideal Background (Optional)</label>
              <span className={styles.helper}>Specific industries or types of companies.</span>
              <textarea value={experienceReq.idealBackground} onChange={e => setExperienceReq({...experienceReq, idealBackground: e.target.value})} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.formGroup}>
            <div className={styles.field}>
              <label>Education Requirement (Optional)</label>
              <input type="text" value={constraints.education} onChange={e => setConstraints({...constraints, education: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Location (City) *</label>
              <input type="text" value={constraints.city} onChange={e => setConstraints({...constraints, city: e.target.value})} disabled={constraints.isRemote} required={!constraints.isRemote} />
            </div>
            <div className={styles.checkboxField}>
              <input type="checkbox" checked={constraints.isRemote} onChange={e => setConstraints({...constraints, isRemote: e.target.checked})} />
              <label>This role is fully Remote</label>
            </div>
            <div className={styles.field}>
              <label>Mandatory Skills *</label>
              <input type="text" placeholder="Comma separated" value={constraints.mandatorySkills} onChange={e => setConstraints({...constraints, mandatorySkills: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Max CTC (LPA, Optional)</label>
              <input type="number" value={constraints.maxCtc} onChange={e => setConstraints({...constraints, maxCtc: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Notice Period *</label>
              <select value={constraints.noticePeriod} onChange={e => setConstraints({...constraints, noticePeriod: e.target.value})}>
                <option value="Immediate">Immediate</option>
                <option value="30">30 Days or less</option>
                <option value="60">60 Days or less</option>
                <option value="90">90 Days or less</option>
              </select>
            </div>
          </div>
        );
      case 5:
        return (
          <div className={styles.reviewGroup}>
            <h3>Review Role Details</h3>
            <div className={styles.reviewSection}>
              <h4>Basic Info</h4>
              <p>Manager: {basicInfo.fullName}</p>
              <p>Email: {basicInfo.email}</p>
            </div>
            <div className={styles.reviewSection}>
              <h4>Role</h4>
              <p>{roleBasics.title} ({roleBasics.hiringType})</p>
              {roleBasics.department && <p>Department: {roleBasics.department}</p>}
            </div>
            <div className={styles.reviewSection}>
              <h4>Problem Statement</h4>
              <p><strong>Context:</strong> {problemStatement.businessContext}</p>
              <p><strong>Problem:</strong> {problemStatement.problemToSolve}</p>
              <p><strong>Why Needed:</strong> {problemStatement.whyNeeded}</p>
              <p><strong>Metrics:</strong> {problemStatement.metrics}</p>
            </div>
            <div className={styles.reviewSection}>
              <h4>Requirements & Constraints</h4>
              <p>Experience: {experienceReq.minYears}+ years</p>
              <p>Location: {constraints.isRemote ? 'Remote' : constraints.city}</p>
              <p>Skills: {constraints.mandatorySkills}</p>
              {constraints.maxCtc && <p>Max CTC: {constraints.maxCtc} LPA</p>}
            </div>
          </div>
        );
    }
  };

  const progressPercentage = Math.round(((currentSection + 1) / SECTIONS.length) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <span>{SECTIONS[currentSection]}</span>
          <span>{progressPercentage}% Completed</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>{SECTIONS[currentSection]}</h2>
        {renderSection()}
      </div>

      <div className={styles.actions}>
        {currentSection > 0 && (
          <button type="button" className={styles.secondaryBtn} onClick={prevSection} disabled={isSubmitting}>
            Back
          </button>
        )}
        
        {currentSection < SECTIONS.length - 1 ? (
          <button type="button" className={styles.primaryBtn} onClick={nextSection}>
            Save & Continue
          </button>
        ) : (
          <button type="button" className={styles.primaryBtn} onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Post Role & Create Profile'}
          </button>
        )}
      </div>
    </div>
  );
}
