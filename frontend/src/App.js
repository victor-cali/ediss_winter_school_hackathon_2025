import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Alerts from './components/Alerts';
import Cameras from './components/Cameras';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/cameras" element={<Cameras />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
