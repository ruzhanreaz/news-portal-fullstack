import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';

export default function CreateNews() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) { alert('Title cannot be empty'); return; }
        if (body.trim().length < 20) { alert('Content must be at least 20 characters'); return; }

        try {
            await apiFetch('/news', {
                method: 'POST',
                // author_id comes from JWT token on the backend
                body: JSON.stringify({ title: title.trim(), body: body.trim() })
            });
            alert('News created successfully!');
            navigate('/news');
        } catch {
            alert('Failed to create news.');
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
                <h2>Create News</h2>
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
                    <button type="submit" className="btn btn-primary">Create News</button>
                </form>
            </div>
        </div>
    );
}
