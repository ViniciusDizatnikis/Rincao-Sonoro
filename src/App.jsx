import './index.css'
import Header from './components/Header'
import Main from './components/Main'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Artists from './pages/Artists'
import Home from './pages/Home'
import Artist from './pages/Artist'
import Songs from './pages/Songs'
import Song from './pages/Song.jsx'
import Password from './pages/Password.jsx'
import Add from './pages/Add'

window.addEventListener('beforeunload', () => {
  if (performance.navigation.type === 1) {
    sessionStorage.removeItem('accessGranted');
  }
});

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artist/:id" element={<Artist />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/song/:id/:type" element={<Song />} />
        <Route path="/password" element={<Password />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
