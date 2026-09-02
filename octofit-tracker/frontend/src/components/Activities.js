import { useEffect, useState } from 'react';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  const loadActivities = () => {
    setError('');
    console.log('Fetching activities from:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Activities API data:', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
      })
      .catch((requestError) => setError(requestError.message));
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const visibleActivities = activities.filter((activity) => activity.activity_type.toLowerCase().includes(filter.toLowerCase()));

  return <section><div className="card resource-card"><div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"><div><h1 className="h2 mb-1">Activities</h1><a className="link-primary small" href={endpoint} target="_blank" rel="noreferrer">REST API endpoint</a></div><button className="btn btn-primary" type="button" onClick={loadActivities}>Refresh</button></div><div className="card-body"><form className="row g-2 mb-4" onSubmit={(event) => event.preventDefault()}><div className="col-sm-6"><label className="form-label" htmlFor="activity-filter">Filter activity type</label><input className="form-control" id="activity-filter" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="e.g. Running" /></div></form>{error && <div className="alert alert-danger">{error}</div>}<div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Activity</th><th>Duration</th><th>Date</th><th>Points</th><th aria-label="Actions" /></tr></thead><tbody>{visibleActivities.map((activity) => <tr key={activity.id}><td>{activity.activity_type}</td><td>{activity.duration} min</td><td>{activity.date}</td><td>{activity.points}</td><td><button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setSelectedActivity(activity)}>View</button></td></tr>)}{!visibleActivities.length && <tr><td colSpan="5" className="text-center text-muted py-4">No activities found.</td></tr>}</tbody></table></div></div></div>{selectedActivity && <div className="modal d-block" role="dialog" aria-modal="true"><div className="modal-dialog"><div className="modal-content"><div className="modal-header"><h2 className="modal-title h5">Activity details</h2><button className="btn-close" type="button" aria-label="Close" onClick={() => setSelectedActivity(null)} /></div><div className="modal-body"><p><strong>{selectedActivity.activity_type}</strong> lasted {selectedActivity.duration} minutes.</p><p className="mb-0">{selectedActivity.date} · {selectedActivity.points} points</p></div><div className="modal-footer"><button className="btn btn-secondary" type="button" onClick={() => setSelectedActivity(null)}>Close</button></div></div></div></div>}</section>;
}

export default Activities;