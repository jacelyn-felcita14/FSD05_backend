import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestAPI } from '../services/api';

const ApproverDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchAllRequests();
    }, [statusFilter]);

    const fetchAllRequests = async () => {
        try {
            setLoading(true);
            const response = await requestAPI.getAllRequests(statusFilter);
            if (response.success) {
                setRequests(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        setError('');
        setSuccess('');
        setProcessingId(requestId);

        try {
            const response = await requestAPI.approveRequest(requestId);

            if (response.success) {
                setSuccess('Request approved successfully!');
                fetchAllRequests(); // Refresh the list

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to approve request';
            setError(message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId) => {
        setError('');
        setSuccess('');
        setProcessingId(requestId);

        try {
            const response = await requestAPI.rejectRequest(requestId);

            if (response.success) {
                setSuccess('Request rejected successfully!');
                fetchAllRequests(); // Refresh the list

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reject request';
            setError(message);
        } finally {
            setProcessingId(null);
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

    const pendingRequests = requests.filter(req => req.status === 'PENDING');
    const processedRequests = requests.filter(req => req.status !== 'PENDING');

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">Access Request Portal</div>
                    <div className="navbar-user">
                        <div className="user-info">
                            <div className="user-name">{user?.username}</div>
                            <div className="user-role">Approver</div>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-container">
                <div className="container">
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <h1 style={{ marginBottom: 0 }}>Approver Dashboard</h1>

                        {/* Status Filter */}
                        <div style={{ minWidth: '200px' }}>
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Requests</option>
                                <option value="PENDING">Pending Only</option>
                                <option value="APPROVED">Approved Only</option>
                                <option value="REJECTED">Rejected Only</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    {/* Statistics Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: 'var(--font-size-3xl)', margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-pending)' }}>
                                {pendingRequests.length}
                            </h3>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Pending</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: 'var(--font-size-3xl)', margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-approved)' }}>
                                {requests.filter(r => r.status === 'APPROVED').length}
                            </h3>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Approved</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: 'var(--font-size-3xl)', margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-rejected)' }}>
                                {requests.filter(r => r.status === 'REJECTED').length}
                            </h3>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Rejected</p>
                        </div>
                    </div>

                    {/* Pending Requests */}
                    {pendingRequests.length > 0 && (
                        <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                            <div className="card-header">
                                <h2 className="card-title">Pending Requests ({pendingRequests.length})</h2>
                            </div>

                            {loading ? (
                                <div>
                                    <div className="spinner"></div>
                                    <p className="loading-text">Loading requests...</p>
                                </div>
                            ) : (
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Requester</th>
                                                <th>Email</th>
                                                <th>Type</th>
                                                <th>Resource</th>
                                                <th>Reason</th>
                                                <th>Submitted</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingRequests.map((request) => (
                                                <tr key={request._id}>
                                                    <td>{request.userId?.username}</td>
                                                    <td>{request.userId?.email}</td>
                                                    <td>{request.requestDetails.type}</td>
                                                    <td>{request.requestDetails.resource}</td>
                                                    <td style={{ maxWidth: '250px' }}>
                                                        {request.requestDetails.reason}
                                                    </td>
                                                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="btn-group gap-1">
                                                            <button
                                                                onClick={() => handleApprove(request._id)}
                                                                className="btn btn-success"
                                                                disabled={processingId === request._id}
                                                                style={{ padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)' }}
                                                            >
                                                                {processingId === request._id ? '...' : 'Approve'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(request._id)}
                                                                className="btn btn-danger"
                                                                disabled={processingId === request._id}
                                                                style={{ padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)' }}
                                                            >
                                                                {processingId === request._id ? '...' : 'Reject'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* All Requests / Processed Requests */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">
                                {statusFilter ? 'Filtered Requests' : 'All Requests'} ({requests.length})
                            </h2>
                        </div>

                        {loading ? (
                            <div>
                                <div className="spinner"></div>
                                <p className="loading-text">Loading requests...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--spacing-xl)' }}>
                                No requests found.
                            </p>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Requester</th>
                                            <th>Email</th>
                                            <th>Type</th>
                                            <th>Resource</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((request) => (
                                            <tr key={request._id}>
                                                <td>{request.userId?.username}</td>
                                                <td>{request.userId?.email}</td>
                                                <td>{request.requestDetails.type}</td>
                                                <td>{request.requestDetails.resource}</td>
                                                <td style={{ maxWidth: '250px' }}>
                                                    {request.requestDetails.reason}
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    {request.status === 'PENDING' ? (
                                                        <div className="btn-group gap-1">
                                                            <button
                                                                onClick={() => handleApprove(request._id)}
                                                                className="btn btn-success"
                                                                disabled={processingId === request._id}
                                                                style={{ padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)' }}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(request._id)}
                                                                className="btn btn-danger"
                                                                disabled={processingId === request._id}
                                                                style={{ padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)' }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                                                            Processed
                                                        </span>
                                                    )}
                                                </td>
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

export default ApproverDashboard;
