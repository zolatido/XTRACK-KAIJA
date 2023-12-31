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
        <Route path='/XTRACK-KAIJA/' element={<Welcome />} />
        <Route path='/XTRACK-KAIJA/login' element={<Login />} />
        <Route path='/XTRACK-KAIJA/register' element={<Register />} />
        <Route path='/XTRACK-KAIJA/home' element={<Home />} />
        <Route path='/XTRACK-KAIJA/about' element={<About />} />
        <Route path='/XTRACK-KAIJA/feature' element={<Feature />} />
        <Route path='/XTRACK-KAIJA/profile' element={<Profile />} />
        <Route path='/XTRACK-KAIJA/chart' element={<Charts />} />
      </Routes>
    </div>
  )
}

export default App
