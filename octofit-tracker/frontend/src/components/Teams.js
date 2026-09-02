import { useEffect, useState } from 'react';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const loadTeams = () => {
    setError('');
    console.log('Fetching teams from:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Teams API data:', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
      })
      .catch((requestError) => setError(requestError.message));
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const visibleTeams = teams.filter((team) => team.name.toLowerCase().includes(filter.toLowerCase()));

  return <section><div className="card resource-card"><div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"><div><h1 className="h2 mb-1">Teams</h1><a className="link-primary small" href={endpoint} target="_blank" rel="noreferrer">REST API endpoint</a></div><button className="btn btn-primary" type="button" onClick={loadTeams}>Refresh</button></div><div className="card-body"><form className="row g-2 mb-4" onSubmit={(event) => event.preventDefault()}><div className="col-sm-6"><label className="form-label" htmlFor="team-filter">Filter team name</label><input className="form-control" id="team-filter" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search teams" /></div></form>{error && <div className="alert alert-danger">{error}</div>}<div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Team</th><th>Identifier</th><th aria-label="Actions" /></tr></thead><tbody>{visibleTeams.map((team) => <tr key={team.id}><td>{team.name}</td><td>{team.id}</td><td><button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setSelectedTeam(team)}>View</button></td></tr>)}{!visibleTeams.length && <tr><td colSpan="3" className="text-center text-muted py-4">No teams found.</td></tr>}</tbody></table></div></div></div>{selectedTeam && <div className="modal d-block" role="dialog" aria-modal="true"><div className="modal-dialog"><div className="modal-content"><div className="modal-header"><h2 className="modal-title h5">Team details</h2><button className="btn-close" type="button" aria-label="Close" onClick={() => setSelectedTeam(null)} /></div><div className="modal-body"><p className="mb-0"><strong>{selectedTeam.name}</strong><br />Team ID: {selectedTeam.id}</p></div><div className="modal-footer"><button className="btn btn-secondary" type="button" onClick={() => setSelectedTeam(null)}>Close</button></div></div></div></div>}</section>;
}

export default Teams;