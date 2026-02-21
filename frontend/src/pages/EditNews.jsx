import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';

export default function EditNews() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    async function loadNews() {
        try {
            const res = await apiFetch(`/news/${id}`);
            const news = await res.json();
            if (news.author_id !== currentUser.id) {
                alert('You can only edit your own news!');
                navigate('/news');
                return;
            }
            setTitle(news.title);
            setBody(news.body);
        } catch {
            alert('Failed to load news.');
            navigate('/news');
        }
    }

    useEffect(() => {
        if (!currentUser) { navigate('/login'); return; }
        loadNews(); // eslint-disable-line
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) { alert('Title cannot be empty'); return; }
        if (body.trim().length < 20) { alert('Content must be at least 20 characters'); return; }

        try {
            await apiFetch(`/news/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ title: title.trim(), body: body.trim() })
            });
            alert('News updated successfully!');
            navigate('/news');
        } catch {
            alert('Failed to update news.');
        }
    }

    return (
        <div className="container">
            <div className="header">
                <h1>News Portal</h1>
                <div className="user-info">
                    <span>Logged in as: {currentUser?.name}</span>
                    <Link to="/news" className="btn btn-secondary">Cancel</Link>
                </div>
            </div>

            <div className="form-container">
                <h2>Edit News</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="body">Content * (minimum 20 characters)</label>
                        <textarea
                            id="body"
                            rows="10"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            required
                        />
                        <span className="char-count">{body.length} character{body.length !== 1 ? 's' : ''}</span>
                    </div>
                    <button type="submit" className="btn btn-primary">Update News</button>
                </form>
            </div>
        </div>
    );
}
