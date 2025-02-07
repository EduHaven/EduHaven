import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StudyRoom from './pages/studyRoom/StudyRoom.jsx';
import Dashboard from './pages/Anaylitics/Anaylitics';
import GameRoom from './pages/gameRoom/GameRoutes.jsx';
import MusicRoom from './pages/MusicRoom';
import Signout from './Auth/Signout';
import SignUp from './Auth/Authenticate.jsx';
import ProfileRoutes from './pages/profileSettings/ProfileRoutes.jsx';
import PageNotFound from '../src/pages/PageNotFound';
import ProjectInfo from '../src/pages/ProjectInfo';
function App() {
  const token = localStorage.getItem('token');
  console.log('app.js TOKEN~~~' + token);
  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <>
            <Route path='/authenticate' element={<SignUp />} />
            <Route path='*' element={<Navigate to='/authenticate' replace />} />
          </>
        ) : (
          <Route path='/' element={<Layout />}>
            <Route index element={<StudyRoom />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='games/*' element={<GameRoom />} />
            <Route path='music' element={<MusicRoom />} />
            <Route path='project-details' element={<ProjectInfo />} />
            <Route path='profile/*' element={<ProfileRoutes />} />
            <Route path='signout' element={<Signout />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
