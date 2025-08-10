import React from 'react';

/*
 * Blog page
 * Displays a list of blog articles relevant to Indian law and justice. Each post
 * shows a title, author, date, summary and can expand to reveal full
 * content. In a production app posts could be fetched from a CMS or API.
 */
import { Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts';

const BlogPage = () => {

  return (
    <div className="blog-page">
      {/* Hero section */}
      <section style={{ background: 'linear-gradient(90deg, #007bff, #00a3e0)', color: '#fff', padding: '3rem 1rem', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 700 }}>LegalBridge Blog</h1>
        <p style={{ maxWidth: '700px', margin: '0.75rem auto 0', fontSize: '1.125rem' }}>Insights, guides and stories on Indian law, your rights and navigating the justice system.</p>
      </section>
      <div style={{ padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {blogPosts.map((post) => (
            <article key={post.id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              {/* Placeholder for cover image */}
              <div style={{ height: '150px', background: 'linear-gradient(135deg, #e0e7ff, #f5faff)' }}></div>
              <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.25rem' }}>{post.title}</h3>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.75rem' }}>By {post.author} • {post.date}</div>
                <p style={{ flexGrow: 1, lineHeight: 1.5, color: '#333' }}>{post.summary}</p>
                <Link to={`/blog/${post.id}`} style={{ marginTop: '1rem', alignSelf: 'flex-start', backgroundColor: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500, textDecoration: 'none' }}>
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;