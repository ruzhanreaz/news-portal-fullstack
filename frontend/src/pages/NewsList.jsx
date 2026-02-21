import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, API_URL } from '../api';

export default function NewsList() {
    const [allNews, setAllNews] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!currentUser) { navigate('/login'); return; }
        loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function loadData() {
        try {
            const [newsRes, usersRes] = await Promise.all([
                apiFetch('/news'),
                fetch(`${API_URL}/users`)  // /users is public
            ]);
            setAllNews(await newsRes.json());
            setUsers(await usersRes.json());
        } catch {
            setError('Failed to load news.');
        } finally {
            setLoading(false);
        }
    }

    async function deleteNews(id) {
        if (!confirm('Are you sure you want to delete this news?')) return;
        try {
            await apiFetch(`/news/${id}`, { method: 'DELETE' });
            setAllNews(prev => prev.filter(n => n.id !== id));
        } catch {
            alert('Failed to delete news.');
        }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        navigate('/login');
    }

    const filtered = allNews.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <div className="header">
                <h1>News Portal</h1>
                <div className="user-info">
                    <span>Logged in as: {currentUser?.name}</span>
                    <button onClick={logout} className="btn btn-secondary">Logout</button>
                </div>
            </div>

            <div className="actions">
                <Link to="/news/create" className="btn btn-primary">+ Create News</Link>
                <input
                    type="text"
                    placeholder="Search news by title..."
                    className="search-input"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {loading && <p className="loading">Loading news...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <div className="news-list">
                    {filtered.length === 0 ? (
                        <p className="empty">No news found.</p>
                    ) : (
                        filtered.map(news => {
                            const author = users.find(u => u.id === news.author_id);
                            const commentCount = news.comments ? news.comments.length : 0;
                            return (
                                <div key={news.id} className="news-card">
                                    <h3>{news.title}</h3>
                                    <p className="author">By: {author ? author.name : 'Unknown'}</p>
                                    <p className="preview">{news.body.substring(0, 150)}...</p>
                                    <div className="comment-count">
                                        {commentCount} comment{commentCount !== 1 ? 's' : ''}
                                    </div>
                                    <div className="news-actions">
                                        <Link to={`/news/${news.id}`} className="btn btn-primary">View Details</Link>
                                        {news.author_id === currentUser?.id && (
                                            <>
                                                <Link to={`/news/${news.id}/edit`} className="btn btn-secondary">Edit</Link>
                                                <button onClick={() => deleteNews(news.id)} className="btn btn-danger">Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
