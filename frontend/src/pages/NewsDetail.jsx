import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch, API_URL } from '../api';

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [users, setUsers] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!currentUser) { navigate('/login'); return; }
        loadData();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    async function loadData() {
        try {
            const [newsRes, usersRes] = await Promise.all([
                apiFetch(`/news/${id}`),
                fetch(`${API_URL}/users`)  // /users is public
            ]);
            setNews(await newsRes.json());
            setUsers(await usersRes.json());
        } catch {
            setError('Failed to load news.');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddComment(e) {
        e.preventDefault();
        const text = commentText.trim();
        if (!text) { alert('Comment cannot be empty'); return; }

        try {
            // POST to dedicated comment endpoint — JWT provides the user identity
            const res = await apiFetch(`/news/${id}/comments`, {
                method: 'POST',
                body: JSON.stringify({ text }),
            });
            const updated = await res.json();
            setNews(updated);
            setCommentText('');
        } catch {
            alert('Failed to add comment.');
        }
    }

    if (loading) return <div className="container"><p className="loading">Loading...</p></div>;
    if (error) return <div className="container"><p className="error">{error}</p></div>;

    const author = users.find(u => u.id === news.author_id);

    return (
        <div className="container">
            <div className="header">
                <h1>News Portal</h1>
                <div className="user-info">
                    <span>Logged in as: {currentUser?.name}</span>
                    <Link to="/news" className="btn btn-secondary">Back to List</Link>
                </div>
            </div>

            <div className="news-detail">
                <h2>{news.title}</h2>
                <p className="author">By: {author ? author.name : 'Unknown'}</p>
                <div className="news-body">{news.body}</div>
            </div>

            <div className="comments-section">
                <h3>Comments</h3>
                {(!news.comments || news.comments.length === 0) ? (
                    <p className="empty">No comments yet. Be the first to comment!</p>
                ) : (
                    news.comments.map(comment => {
                        const commenter = users.find(u => u.id === comment.user_id);
                        return (
                            <div key={comment.id} className="comment">
                                <p className="comment-author">{commenter ? commenter.name : 'Unknown'}</p>
                                <p className="comment-text">{comment.text}</p>
                                <p className="comment-time">{new Date(comment.timestamp).toLocaleString()}</p>
                            </div>
                        );
                    })
                )}

                <form onSubmit={handleAddComment} className="comment-form">
                    <h4>Add a Comment</h4>
                    <textarea
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        rows="3"
                        required
                    />
                    <button type="submit" className="btn btn-primary">Post Comment</button>
                </form>
            </div>
        </div>
    );
}
