import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Tlamatini from './pages/Tlamatini';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tlamatini" element={<Tlamatini />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
