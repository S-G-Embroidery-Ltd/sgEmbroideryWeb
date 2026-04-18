import { Navigate } from 'react-router-dom';

/** Legacy route: milestones and news now live on About. */
const Stories = () => <Navigate to="/about#news-updates" replace />;

export default Stories;
