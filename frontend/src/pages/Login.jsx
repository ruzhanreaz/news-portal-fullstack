import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function Login() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const body = mode === 'login'
                ? { username, password }
                : { username, name, password };

            const res = await apiFetch(`/auth/${mode}`, {
                method: 'POST',
                body: JSON.stringify(body),
            });

            if (res.status === 409) {
                alert('Username already taken. Please choose another.');
                setLoading(false);
                return;
            }
            if (!res.ok) {
                alert(mode === 'login' ? 'Invalid username or password.' : 'Registration failed.');
                setLoading(false);
                return;
            }

            const data = await res.json();
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.id,
                name: data.user.name,
                token: data.token,
            }));
            navigate('/news');
        } catch {
            alert('Could not connect to backend.');
        } finally {
            setLoading(false);
        }
    }

    function switchMode() {
        setMode(m => m === 'login' ? 'register' : 'login');
        setUsername('');
        setPassword('');
        setName('');
    }

    return (
        <div className="container">
            <div className="login-card">
                <h1>News Portal</h1>
                <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label htmlFor="name">Display Name:</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your display name"
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter password'}
                            required
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Register'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={switchMode}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: 0 }}
                    >
                        {mode === 'login' ? 'Register' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
}

