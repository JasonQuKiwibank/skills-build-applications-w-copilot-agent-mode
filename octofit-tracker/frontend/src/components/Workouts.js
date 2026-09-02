import { useEffect, useState } from 'react';

const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const loadWorkouts = () => {
    setError('');
    console.log('Fetching workouts from:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Workouts API data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
      })
      .catch((requestError) => setError(requestError.message));
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const visibleWorkouts = workouts.filter((workout) => `${workout.name} ${workout.difficulty}`.toLowerCase().includes(filter.toLowerCase()));

  return <section><div className="card resource-card"><div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"><div><h1 className="h2 mb-1">Workouts</h1><a className="link-primary small" href={endpoint} target="_blank" rel="noreferrer">REST API endpoint</a></div><button className="btn btn-primary" type="button" onClick={loadWorkouts}>Refresh</button></div><div className="card-body"><form className="row g-2 mb-4" onSubmit={(event) => event.preventDefault()}><div className="col-sm-6"><label className="form-label" htmlFor="workout-filter">Find a workout</label><input className="form-control" id="workout-filter" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Name or difficulty" /></div></form>{error && <div className="alert alert-danger">{error}</div>}<div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Workout</th><th>Difficulty</th><th>Duration</th><th aria-label="Actions" /></tr></thead><tbody>{visibleWorkouts.map((workout) => <tr key={workout.id}><td>{workout.name}</td><td>{workout.difficulty}</td><td>{workout.duration} min</td><td><button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setSelectedWorkout(workout)}>View</button></td></tr>)}{!visibleWorkouts.length && <tr><td colSpan="4" className="text-center text-muted py-4">No workouts found.</td></tr>}</tbody></table></div></div></div>{selectedWorkout && <div className="modal d-block" role="dialog" aria-modal="true"><div className="modal-dialog"><div className="modal-content"><div className="modal-header"><h2 className="modal-title h5">Workout details</h2><button className="btn-close" type="button" aria-label="Close" onClick={() => setSelectedWorkout(null)} /></div><div className="modal-body"><p><strong>{selectedWorkout.name}</strong> · {selectedWorkout.difficulty}</p><p>{selectedWorkout.description}</p><p className="mb-0">Duration: {selectedWorkout.duration} minutes</p></div><div className="modal-footer"><button className="btn btn-secondary" type="button" onClick={() => setSelectedWorkout(null)}>Close</button></div></div></div></div>}</section>;
}

export default Workouts;