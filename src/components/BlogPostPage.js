import React from 'react';
import { useParams, Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts';

/*
 * BlogPostPage
 * Displays the full content of a single blog post identified by the URL parameter `id`.
 */
const BlogPostPage = () => {
  const { id } = useParams();
  const postId = parseInt(id, 10);
  const post = blogPosts.find((p) => p.id === postId);
  if (!post) {
    return <div style={{ padding: '2rem' }}><p>Post not found.</p></div>;
  }
  return (
    <div className="blog-post-page" style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Link to="/blog" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--primary)', textDecoration: 'none' }}>&larr; Back to Blog</Link>
      <h1 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '2rem' }}>{post.title}</h1>
      <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>By {post.author} &bull; {post.date}</div>
      {/* Placeholder hero image */}
      <div style={{ height: '200px', background: 'linear-gradient(135deg, #e0e7ff, #f5faff)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}></div>
      {post.content.split('\n').map((para, idx) => (
        <p key={idx} style={{ lineHeight: 1.6, fontSize: '1rem', color: '#333', marginBottom: '1rem' }}>{para}</p>
      ))}
    </div>
  );
};

export default BlogPostPage;