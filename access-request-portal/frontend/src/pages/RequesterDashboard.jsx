import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestAPI } from '../services/api';

const RequesterDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        type: '',
        resource: '',
        reason: ''
    });

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            const response = await requestAPI.getMyRequests();
            if (response.success) {
                setRequests(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load your requests');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.type || !formData.resource || !formData.reason) {
            setError('All fields are required');
            return;
        }

        if (formData.reason.length < 10) {
            setError('Reason must be at least 10 characters');
            return;
        }

        // Check if there's already a pending request
        const hasPending = requests.some(req => req.status === 'PENDING');
        if (hasPending) {
            setError('You already have a pending request. Please wait for it to be reviewed before submitting a new one.');
            return;
        }

        setSubmitting(true);

        try {
            const response = await requestAPI.createRequest(formData);

            if (response.success) {
                setSuccess('Access request submitted successfully!');
                setFormData({ type: '', resource: '', reason: '' });
                fetchMyRequests(); // Refresh the list
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit request';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: 'badge-pending',
            APPROVED: 'badge-approved',
            REJECTED: 'badge-rejected'
        };
        return badges[status] || 'badge-pending';
    };

    const hasPendingRequest = requests.some(req => req.status === 'PENDING');

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">Access Request Portal</div>
                    <div className="navbar-user">
                        <div className="user-info">
                            <div className="user-name">{user?.username}</div>
                            <div className="user-role">Requester</div>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-container">
                <div className="container">
                    <h1 style={{ marginBottom: 'var(--spacing-2xl)' }}>Requester Dashboard</h1>

                    {/* Request Submission Form */}
                    <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div className="card-header">
                            <h2 className="card-title">Submit Access Request</h2>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        {hasPendingRequest && (
                            <div className="alert alert-info">
                                ⚠️ You have a pending request. You can only submit a new request after your current request is reviewed.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="type" className="form-label">Request Type</label>
                                <input
                                    type="text"
                                    id="type"
                                    name="type"
                                    className="form-input"
                                    value={formData.type}
                                    onChange={handleChange}
                                    placeholder="e.g., Database Access, Admin Panel, etc."
                                    required
                                    disabled={hasPendingRequest}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="resource" className="form-label">Resource Name</label>
                                <input
                                    type="text"
                                    id="resource"
                                    name="resource"
                                    className="form-input"
                                    value={formData.resource}
                                    onChange={handleChange}
                                    placeholder="e.g., Production Database, CRM System, etc."
                                    required
                                    disabled={hasPendingRequest}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason" className="form-label">Reason for Access</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    className="form-textarea"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Provide a detailed reason for this access request (minimum 10 characters)"
                                    required
                                    disabled={hasPendingRequest}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting || hasPendingRequest}
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>

                    {/* My Requests List */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">My Access Requests</h2>
                        </div>

                        {loading ? (
                            <div>
                                <div className="spinner"></div>
                                <p className="loading-text">Loading your requests...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--spacing-xl)' }}>
                                No access requests found. Submit your first request above!
                            </p>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Resource</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((request) => (
                                            <tr key={request._id}>
                                                <td>{request.requestDetails.type}</td>
                                                <td>{request.requestDetails.resource}</td>
                                                <td style={{ maxWidth: '300px' }}>
                                                    {request.requestDetails.reason}
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequesterDashboard;
