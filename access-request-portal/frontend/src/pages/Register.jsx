import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'REQUESTER'
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

        // Validation
        if (!formData.username || !formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role
        });

        setLoading(false);

        if (result.success) {
            // Redirect based on role
            const redirectPath = result.user.role === 'REQUESTER' ? '/requester' : '/approver';
            navigate(redirectPath);
        } else {
            setError(result.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-header">
                    <h1 className="card-title text-center">Create Account</h1>
                    <p className="text-center" style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                        Join Access Request Portal
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-input"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

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
                            placeholder="Create a password (min 6 characters)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role" className="form-label">Select Role</label>
                        <select
                            id="role"
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="REQUESTER">Requester - Submit access requests</option>
                            <option value="APPROVER">Approver - Review and approve requests</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-3" style={{ color: 'var(--color-text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
