"use client";

import React, { useState, useRef } from 'react';
import styles from './MultiStepForm.module.css';
import { supabase } from '@/lib/supabaseClient';

const SECTIONS = [
  'Basic Info', 'Resume', 'Education', 'Experience', 'Projects', 'Preferences', 'Review'
];

interface Props {
  onSubmitComplete: () => void;
}

export default function ExperiencedProfessionalForm({ onSubmitComplete }: Props) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [basicInfo, setBasicInfo] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [resumeUrl, setResumeUrl] = useState('');
  const [education, setEducation] = useState([{ degree: '', fieldOfStudy: '', university: '', graduationYear: '', score: '' }]);
  const [experience, setExperience] = useState([{ companyName: '', role: '', startDate: '', endDate: '', isPresent: false }]);
  const [projects, setProjects] = useState([{ title: '', problemStatement: '', role: '', duration: '', approach: '', outcome: '', skills: '', learnings: '' }]);
  const [preferences, setPreferences] = useState({ city: 'Pune', customCity: '', expectedCtc: '', noticePeriod: '30' });

  // Add/Remove Handlers
  const addEducation = () => {
    if (education.length < 3) setEducation([...education, { degree: '', fieldOfStudy: '', university: '', graduationYear: '', score: '' }]);
  };
  const removeEducation = (index: number) => setEducation(education.filter((_, i) => i !== index));

  const addExperience = () => setExperience([...experience, { companyName: '', role: '', startDate: '', endDate: '', isPresent: false }]);
  const removeExperience = (index: number) => setExperience(experience.filter((_, i) => i !== index));

  const addProject = () => {
    if (projects.length < 5) setProjects([...projects, { title: '', problemStatement: '', role: '', duration: '', approach: '', outcome: '', skills: '', learnings: '' }]);
  };
  const removeProject = (index: number) => setProjects(projects.filter((_, i) => i !== index));

  // Validation
  const validateSection = () => {
    if (currentSection === 0) {
      return basicInfo.fullName && basicInfo.email && basicInfo.password && basicInfo.phone;
    }
    if (currentSection === 2) {
      return education.every(e => e.degree && e.university && e.graduationYear);
    }
    if (currentSection === 3) {
      return experience.every(e => e.companyName && e.role && e.startDate && (e.endDate || e.isPresent));
    }
    if (currentSection === 4) {
      if (projects.length < 2) {
        setError('Minimum 2 projects required.');
        return false;
      }
      const valid = projects.every(p => 
        p.title && 
        p.problemStatement.length >= 80 && 
        p.role && 
        p.approach.length >= 100 && 
        p.outcome && 
        p.learnings.length >= 50
      );
      if (!valid) setError('Please fill all project details adhering to the minimum character limits.');
      return valid;
    }
    if (currentSection === 5) {
      return (preferences.city !== 'Others' || preferences.customCity) && preferences.expectedCtc && preferences.noticePeriod;
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

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      // In a real app, upload to Supabase Storage and get URL
      setResumeUrl(file.name);
      
      // Auto-fill logic via API
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error during upload');
      }

      if (data.text) {
        const text = data.text;
        const parsedEducation = [];
        
        // Simple heuristic to extract education
        const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
        let inEdu = false;
        
        for (let i = 0; i < lines.length; i++) {
          const lower = lines[i].toLowerCase();
          if (lower === 'education' || lower === 'academic background') {
            inEdu = true;
            continue;
          }
          if (inEdu && (lower === 'experience' || lower === 'projects' || lower === 'skills')) {
            inEdu = false;
          }
          
          if (inEdu && lines[i].length > 5) {
            if (lower.includes('bachelor') || lower.includes('b.tech') || lower.includes('b.e') || lower.includes('master') || lower.includes('m.tech') || lower.includes('mba')) {
              parsedEducation.push({
                degree: lines[i],
                fieldOfStudy: '',
                university: lines[i + 1] ? lines[i + 1] : 'Unknown University',
                graduationYear: '2020', // Default fallback
                score: ''
              });
            }
          }
        }

        if (parsedEducation.length > 0) {
          setEducation(parsedEducation);
          alert("Resume parsed successfully! Education fields have been auto-filled from your resume.");
        } else {
          // Fallback if parsing fails but text exists
          setEducation([{
             degree: 'Degree Extracted (Please Verify)',
             fieldOfStudy: '',
             university: 'University Extracted (Please Verify)',
             graduationYear: '2020',
             score: ''
          }]);
          alert("Resume parsed successfully! We attempted to auto-fill Education, please verify the details.");
        }
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(err.message || 'Resume upload failed.');
    }
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

      // 2. Insert Profile
      const { error: profileError } = await supabase.from('experienced_professionals').insert({
        user_id: userId,
        email: basicInfo.email,
        full_name: basicInfo.fullName,
        phone: basicInfo.phone,
        resume_url: resumeUrl,
        education: education,
        experience: experience,
        projects: projects,
        preferences: {
          city: preferences.city === 'Others' ? preferences.customCity : preferences.city,
          expectedCtc: preferences.expectedCtc,
          noticePeriod: preferences.noticePeriod
        }
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
            <div className={styles.uploadArea}>
              <p>Upload your resume to auto-fill your profile (PDF/DOCX)</p>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
              {resumeUrl && <p className={styles.successText}>Uploaded: {resumeUrl}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.formGroup}>
            {education.map((edu, idx) => (
              <div key={idx} className={styles.repeatableBlock}>
                <h4>Education {idx + 1}</h4>
                <div className={styles.field}>
                  <label>Degree *</label>
                  <input type="text" value={edu.degree} onChange={e => { const newEdu = [...education]; newEdu[idx].degree = e.target.value; setEducation(newEdu); }} />
                </div>
                <div className={styles.field}>
                  <label>Field of Study</label>
                  <input type="text" value={edu.fieldOfStudy} onChange={e => { const newEdu = [...education]; newEdu[idx].fieldOfStudy = e.target.value; setEducation(newEdu); }} />
                </div>
                <div className={styles.field}>
                  <label>University *</label>
                  <input type="text" value={edu.university} onChange={e => { const newEdu = [...education]; newEdu[idx].university = e.target.value; setEducation(newEdu); }} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Graduation Year *</label>
                    <input type="number" value={edu.graduationYear} onChange={e => { const newEdu = [...education]; newEdu[idx].graduationYear = e.target.value; setEducation(newEdu); }} />
                  </div>
                  <div className={styles.field}>
                    <label>Score (CGPA/%)</label>
                    <input type="text" value={edu.score} onChange={e => { const newEdu = [...education]; newEdu[idx].score = e.target.value; setEducation(newEdu); }} />
                  </div>
                </div>
                {idx > 0 && <button type="button" className={styles.removeBtn} onClick={() => removeEducation(idx)}>Remove</button>}
              </div>
            ))}
            {education.length < 3 && <button type="button" className={styles.addBtn} onClick={addEducation}>+ Add Education</button>}
          </div>
        );
      case 3:
        return (
          <div className={styles.formGroup}>
            {experience.map((exp, idx) => (
              <div key={idx} className={styles.repeatableBlock}>
                <h4>Experience {idx + 1}</h4>
                <div className={styles.field}>
                  <label>Company Name *</label>
                  <input type="text" value={exp.companyName} onChange={e => { const newExp = [...experience]; newExp[idx].companyName = e.target.value; setExperience(newExp); }} />
                </div>
                <div className={styles.field}>
                  <label>Role *</label>
                  <input type="text" value={exp.role} onChange={e => { const newExp = [...experience]; newExp[idx].role = e.target.value; setExperience(newExp); }} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Start Date *</label>
                    <input type="month" value={exp.startDate} onChange={e => { const newExp = [...experience]; newExp[idx].startDate = e.target.value; setExperience(newExp); }} />
                  </div>
                  <div className={styles.field}>
                    <label>End Date</label>
                    <input type="month" value={exp.endDate} disabled={exp.isPresent} onChange={e => { const newExp = [...experience]; newExp[idx].endDate = e.target.value; setExperience(newExp); }} />
                  </div>
                </div>
                <div className={styles.checkboxField}>
                  <input type="checkbox" checked={exp.isPresent} onChange={e => { const newExp = [...experience]; newExp[idx].isPresent = e.target.checked; if(e.target.checked) newExp[idx].endDate = ''; setExperience(newExp); }} />
                  <label>I currently work here</label>
                </div>
                {idx > 0 && <button type="button" className={styles.removeBtn} onClick={() => removeExperience(idx)}>Remove</button>}
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addExperience}>+ Add Experience</button>
          </div>
        );
      case 4:
        return (
          <div className={styles.formGroup}>
            <p className={styles.helpText}>Provide details for 2 to 5 core projects you have driven.</p>
            {projects.map((proj, idx) => (
              <div key={idx} className={styles.repeatableBlock}>
                <h4>Project {idx + 1}</h4>
                <div className={styles.field}>
                  <label>Project Title *</label>
                  <input type="text" value={proj.title} onChange={e => { const p = [...projects]; p[idx].title = e.target.value; setProjects(p); }} />
                </div>
                <div className={styles.field}>
                  <label>Context / Problem Statement *</label>
                  <span className={styles.helper}>Min 80 chars. Example: The client's legacy system was causing a 30% drop in transaction success...</span>
                  <textarea value={proj.problemStatement} onChange={e => { const p = [...projects]; p[idx].problemStatement = e.target.value; setProjects(p); }} />
                  <span className={styles.charCount}>{proj.problemStatement.length}/80 min</span>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Your Role *</label>
                    <input type="text" value={proj.role} onChange={e => { const p = [...projects]; p[idx].role = e.target.value; setProjects(p); }} />
                  </div>
                  <div className={styles.field}>
                    <label>Duration (Months)</label>
                    <input type="number" value={proj.duration} onChange={e => { const p = [...projects]; p[idx].duration = e.target.value; setProjects(p); }} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Approach *</label>
                  <span className={styles.helper}>Min 100 chars. How did you solve it?</span>
                  <textarea value={proj.approach} onChange={e => { const p = [...projects]; p[idx].approach = e.target.value; setProjects(p); }} />
                  <span className={styles.charCount}>{proj.approach.length}/100 min</span>
                </div>
                <div className={styles.field}>
                  <label>Outcome *</label>
                  <span className={styles.helper}>Include metrics. Example: Increased throughput by 45%...</span>
                  <textarea value={proj.outcome} onChange={e => { const p = [...projects]; p[idx].outcome = e.target.value; setProjects(p); }} />
                </div>
                <div className={styles.field}>
                  <label>Skills Used</label>
                  <input type="text" value={proj.skills} placeholder="Comma separated" onChange={e => { const p = [...projects]; p[idx].skills = e.target.value; setProjects(p); }} />
                </div>
                <div className={styles.field}>
                  <label>Key Learnings *</label>
                  <textarea value={proj.learnings} onChange={e => { const p = [...projects]; p[idx].learnings = e.target.value; setProjects(p); }} />
                  <span className={styles.charCount}>{proj.learnings.length}/50 min</span>
                </div>
                {idx > 1 && <button type="button" className={styles.removeBtn} onClick={() => removeProject(idx)}>Remove</button>}
              </div>
            ))}
            {projects.length < 5 && <button type="button" className={styles.addBtn} onClick={addProject}>+ Add Project</button>}
          </div>
        );
      case 5:
        return (
          <div className={styles.formGroup}>
            <div className={styles.field}>
              <label>Preferred City *</label>
              <select value={preferences.city} onChange={e => setPreferences({...preferences, city: e.target.value})}>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {preferences.city === 'Others' && (
              <div className={styles.field}>
                <label>Specify City *</label>
                <input type="text" value={preferences.customCity} onChange={e => setPreferences({...preferences, customCity: e.target.value})} />
              </div>
            )}
            <div className={styles.field}>
              <label>Minimum Expected CTC (LPA) *</label>
              <input type="number" value={preferences.expectedCtc} onChange={e => setPreferences({...preferences, expectedCtc: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Notice Period *</label>
              <select value={preferences.noticePeriod} onChange={e => setPreferences({...preferences, noticePeriod: e.target.value})}>
                <option value="Immediate">Immediate</option>
                <option value="30">30 Days</option>
                <option value="60">60 Days</option>
                <option value="90">90 Days</option>
              </select>
            </div>
          </div>
        );
      case 6:
        return (
          <div className={styles.reviewGroup}>
            <h3>Review Your Profile</h3>
            <div className={styles.reviewSection}>
              <h4>Basic Info</h4>
              <p>Name: {basicInfo.fullName}</p>
              <p>Email: {basicInfo.email}</p>
              <p>Phone: {basicInfo.phone}</p>
            </div>
            <div className={styles.reviewSection}>
              <h4>Education</h4>
              {education.map((e, i) => <p key={i}>{e.degree} at {e.university} ({e.graduationYear})</p>)}
            </div>
            <div className={styles.reviewSection}>
              <h4>Experience</h4>
              {experience.map((e, i) => <p key={i}>{e.role} at {e.companyName}</p>)}
            </div>
            <div className={styles.reviewSection}>
              <h4>Projects</h4>
              <p>{projects.length} projects documented.</p>
            </div>
            <div className={styles.reviewSection}>
              <h4>Preferences</h4>
              <p>City: {preferences.city === 'Others' ? preferences.customCity : preferences.city}</p>
              <p>CTC: {preferences.expectedCtc} LPA</p>
              <p>Notice: {preferences.noticePeriod}</p>
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
            {isSubmitting ? 'Submitting...' : 'Complete Profile'}
          </button>
        )}
      </div>
    </div>
  );
}
