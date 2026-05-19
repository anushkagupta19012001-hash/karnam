"use client";

import React, { useState } from 'react';
import styles from './BlogSection.module.css';

const blogs = [
  {
    id: 1,
    title: "Why personal connections matter in hiring. And why they are often not enough.",
    image: "/karnam/blog_1.png",
    content: `As you get more experience in your career the way you find new jobs starts to change. At the beginning you can use job websites. Apply to many positions. As time goes on personal connections become really important. You hear about jobs from people you know and they introduce you to new opportunities. You start to rely on these personal referrals than on sending out lots of applications to people you do not know.

This makes sense because when you have a lot of experience hiring is not about filling a position. It is about finding someone who can be trusted to do a job. If someone you have worked with before recommends you that means a lot. It helps the person hiring to make a decision and with more confidence. That is why many experienced professionals depend on their connections to find new jobs.

However there is a problem with this approach.

The people in your network are the people you have worked with met and interacted with. Even if you have built relationships with them there are only a few people who really understand what you can do. The job opportunities that come through your network are limited to what those people know about.

This creates a problem. You might be really good at something. If the people in your network do not know about those jobs you will never hear about them. It is not that those jobs do not exist it is just that there is no connection between you and those jobs.

At the time the people who are hiring face the same problem. They also rely on their networks to find people they can trust. But their networks are limited too. They often know people from the companies or industries. So they might miss out on good candidates who are not in their network.

This is where relying on connections starts to not work. While your network is valuable it is also limited. It is good for finding jobs that're similar to what you are doing now but it is not good for finding the best job for you overall.

In hiring people what you really need is to find the people who have the right skills for the job. Personal connections can help with that. They do not always work.

That is why after a point just relying on your network is not enough. What you need is a way for your actual work to be seen by people who have jobs that you would be good at. Even if they are not in your network.

Because, in the end the goal is not just to find a job through someone you know but to be considered for any job where your experience would be a fit.`
  },
  {
    id: 2,
    title: "Why does finding the right candidate take long?",
    image: "/karnam/blog_2.png",
    content: `Hiring can be a slow process. It takes a time to find the right person for the job. This process can take weeks or even months. It does not seem like it should take that long. The reason it takes so long is that the process starts out very broadly. It takes a while to get to the point where the right person is found.

When a job opens up the description of the job is usually very general. It lists the responsibilities and the skills and experience that are needed. This description is sent out to a lot of people. It seems like this would be a thing because it would bring in a lot of candidates. The problem is that most of the people who apply are not really a good fit for the job.

So the people, in charge of hiring have to spend a lot of time looking through resumes and doing interviews. They have to narrow down the list of candidates to find the person. This takes a time because the description of the job is not very specific.

The truth is that most companies are looking for someone who can solve a problem. They are not just looking for a manager or leader. They need someone who can fix an issue. It takes a while to figure out what that issue is and who can fix it.

Because it takes long to figure out what the company needs a lot of time is wasted looking at candidates who are not a good fit. This is what makes the hiring process seem slow. It is not that it is hard to make a decision. It is just that it takes a time to get to the point where a decision can be made.

If the process started with an idea of what the problem is and who can solve it things would be a lot easier. There would be candidates to look at but they would be more relevant. It would be easier to make a decision. It would not take as long.

Until that happens hiring is going to seem like a slow process. It is not that the right person is hard to find. It is just that the way we go about finding them is not very direct.`
  },
  {
    id: 3,
    title: "Why do most job applications never get a response?",
    image: "/karnam/blog_3.png",
    content: `It's a feeling. You see a job that seems like a fit for your skills. You take time to make your resume look good maybe even write a note and submit it hoping to hear back. Days turn into weeks. Often there is no response at all. Over time this silence starts to feel like its about you like there's something missing in your profile. But in cases the issue is not the person applying. It's how companies handle applications.

Companies get a lot of applications today more than they can really look at. For one job it's not uncommon to get hundreds of applications. To deal with this companies use filters to narrow down the list. These filters look at things like job titles, keywords, company names or years of work. This helps manage the number of applications. It also has a big limitation: it doesn't look at what someone actually did.

A resume is a summary. It lists what you did what you achieved and tells a story. It can't show how you work in real situations. How you handle uncertainty, what choices you make when things are tough or how your actions lead to results. These are the things that show if someone is really right for a job. They're hard to see in a quick look.

So the process gets focused on being fast than thorough. People who don't match the patterns get filtered out even if they might be great for the job if someone looked closer. This is why many qualified people never hear back. Not because they're not qualified. Because their qualifications aren't visible in the system.

The lack of response is more about how companies handle applications than about the person applying. Until companies change how they look at candidates to focus on work and results this gap, between being qualified and being noticed is likely to keep happening.`
  }
];

export default function BlogSection() {
  const [activeBlog, setActiveBlog] = useState<number | null>(null);

  const selectedBlog = blogs.find(b => b.id === activeBlog);

  return (
    <section className={styles.section} id="blog">
      <div className={styles.container}>
        <h2 className={styles.heading}>Blogs</h2>
        <div className={styles.grid}>
          {blogs.map(blog => (
            <div 
              key={blog.id} 
              className={styles.card}
              onClick={() => setActiveBlog(blog.id)}
            >
              <img src={blog.image} alt={blog.title} className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{blog.title}</h3>
                <p className={styles.readMore}>Read article &rarr;</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeBlog && selectedBlog && (
        <div className={styles.modalOverlay} onClick={() => setActiveBlog(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setActiveBlog(null)}>
              &times;
            </button>
            <img src={selectedBlog.image} alt={selectedBlog.title} className={styles.modalImage} />
            <h2 className={styles.modalTitle}>{selectedBlog.title}</h2>
            <div className={styles.modalBody}>
              {selectedBlog.content.split('\\n\\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
