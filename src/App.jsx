// Import specific elements from the 'react-router-dom' library.
import { Route, Routes } from 'react-router-dom';

// Import various components and pages from their respective locations.
import Welcome from './pages/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import About from './pages/About';
import Feature from './pages/Feature';
import Profile from './pages/Profile';
import Charts from './pages/Charts';

function App() {

  return (
    <div>
      {/* Render the navigation bar component */}
      <NavBar />
      <Routes>
        {/* Define routes for your application */}
        <Route path='/x-track-web/' element={<Welcome />} />
        <Route path='/x-track-web/login' element={<Login />} />
        <Route path='/x-track-web/register' element={<Register />} />
        <Route path='/x-track-web/home' element={<Home />} />
        <Route path='/x-track-web/about' element={<About />} />
        <Route path='/x-track-web/feature' element={<Feature />} />
        <Route path='/x-track-web/profile' element={<Profile />} />
        <Route path='/x-track-web/chart' element={<Charts />} />
      </Routes>
    </div>
  )
}

export default App
