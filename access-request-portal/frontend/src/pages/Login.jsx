import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        setLoading(true);

        const result = await login(formData.email, formData.password);

        setLoading(false);

        if (result.success) {
            // Redirect based on role
            const redirectPath = result.user.role === 'REQUESTER' ? '/requester' : '/approver';
            navigate(redirectPath);
        } else {
            setError(result.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="card-header">
                    <h1 className="card-title text-center">Welcome Back</h1>
                    <p className="text-center" style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                        Sign in to your account
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-3" style={{ color: 'var(--color-text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
