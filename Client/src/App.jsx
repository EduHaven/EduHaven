import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import StudyRoom from './pages//studyRoom/StudyRoom.jsx';
import Dashboard from './pages/Dashboard';
import GameRoom from './pages/GameRoom';
import MusicRoom from './pages/MusicRoom'
import Signout from './Auth/Signout';
import SignUp from './Auth/Authenticate.jsx';
import ProfilePage from './pages/ProfilePage.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudyRoom />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="games" element={<GameRoom />} />
          <Route path="music" element={<MusicRoom />} />
          <Route path="authenticate" element={<SignUp />} />
          {/* Unnecessary / removed. http://localhost:5173/signout loads after this, button is inactive right now */}
          <Route path="signout" element={<Signout />} /> 
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;