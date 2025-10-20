import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PanelAdminPage from './pages/PanelAdminPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './secure/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route
          path='/panel-admin'
          element={
            <ProtectedRoute>
              <PanelAdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
