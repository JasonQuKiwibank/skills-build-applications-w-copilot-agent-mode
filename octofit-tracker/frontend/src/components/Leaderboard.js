import { useEffect, useState } from 'react';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const loadEntries = () => {
    setError('');
    console.log('Fetching leaderboard from:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard API data:', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
      })
      .catch((requestError) => setError(requestError.message));
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const visibleEntries = entries.filter((entry) => String(entry.team).includes(filter));

  return <section><div className="card resource-card"><div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"><div><h1 className="h2 mb-1">Leaderboard</h1><a className="link-primary small" href={endpoint} target="_blank" rel="noreferrer">REST API endpoint</a></div><button className="btn btn-primary" type="button" onClick={loadEntries}>Refresh</button></div><div className="card-body"><form className="row g-2 mb-4" onSubmit={(event) => event.preventDefault()}><div className="col-sm-6"><label className="form-label" htmlFor="leaderboard-filter">Filter team ID</label><input className="form-control" id="leaderboard-filter" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Team ID" /></div></form>{error && <div className="alert alert-danger">{error}</div>}<div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Rank</th><th>User</th><th>Team</th><th>Points</th><th aria-label="Actions" /></tr></thead><tbody>{visibleEntries.map((entry) => <tr key={entry.id}><td>{entry.rank}</td><td>{entry.user}</td><td>{entry.team}</td><td>{entry.points}</td><td><button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setSelectedEntry(entry)}>View</button></td></tr>)}{!visibleEntries.length && <tr><td colSpan="5" className="text-center text-muted py-4">No leaderboard entries found.</td></tr>}</tbody></table></div></div></div>{selectedEntry && <div className="modal d-block" role="dialog" aria-modal="true"><div className="modal-dialog"><div className="modal-content"><div className="modal-header"><h2 className="modal-title h5">Leaderboard entry</h2><button className="btn-close" type="button" aria-label="Close" onClick={() => setSelectedEntry(null)} /></div><div className="modal-body"><p><strong>Rank {selectedEntry.rank}</strong></p><p className="mb-0">User {selectedEntry.user}, Team {selectedEntry.team} · {selectedEntry.points} points</p></div><div className="modal-footer"><button className="btn btn-secondary" type="button" onClick={() => setSelectedEntry(null)}>Close</button></div></div></div></div>}</section>;
}

export default Leaderboard;