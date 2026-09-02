import { useEffect, useState } from 'react';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = () => {
    setError('');
    console.log('Fetching users from:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Users API data:', data);
        setUsers(Array.isArray(data) ? data : data.results || []);
      })
      .catch((requestError) => setError(requestError.message));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const visibleUsers = users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(filter.toLowerCase()));

  return <section><div className="card resource-card"><div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"><div><h1 className="h2 mb-1">Users</h1><a className="link-primary small" href={endpoint} target="_blank" rel="noreferrer">REST API endpoint</a></div><button className="btn btn-primary" type="button" onClick={loadUsers}>Refresh</button></div><div className="card-body"><form className="row g-2 mb-4" onSubmit={(event) => event.preventDefault()}><div className="col-sm-6"><label className="form-label" htmlFor="user-filter">Find a user</label><input className="form-control" id="user-filter" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Name or email" /></div></form>{error && <div className="alert alert-danger">{error}</div>}<div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Name</th><th>Email</th><th>Team</th><th aria-label="Actions" /></tr></thead><tbody>{visibleUsers.map((user) => <tr key={user.id}><td>{user.name}</td><td><a className="link-primary" href={`mailto:${user.email}`}>{user.email}</a></td><td>{user.team || 'Unassigned'}</td><td><button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setSelectedUser(user)}>View</button></td></tr>)}{!visibleUsers.length && <tr><td colSpan="4" className="text-center text-muted py-4">No users found.</td></tr>}</tbody></table></div></div></div>{selectedUser && <div className="modal d-block" role="dialog" aria-modal="true"><div className="modal-dialog"><div className="modal-content"><div className="modal-header"><h2 className="modal-title h5">User details</h2><button className="btn-close" type="button" aria-label="Close" onClick={() => setSelectedUser(null)} /></div><div className="modal-body"><p><strong>{selectedUser.name}</strong></p><p>{selectedUser.email}</p><p className="mb-0">Team: {selectedUser.team || 'Unassigned'}</p></div><div className="modal-footer"><button className="btn btn-secondary" type="button" onClick={() => setSelectedUser(null)}>Close</button></div></div></div></div>}</section>;
}

export default Users;