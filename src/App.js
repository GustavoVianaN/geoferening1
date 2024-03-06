import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Events from './components/eventsList/Events';
import EventsInclude from './components/eventsInclude/EventsInclude';
import Tipo from './components/tipos/tipos';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  return (
    <Router>
      <div className="App">
        <header className="container">
          <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
          <Navbar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
          <Routes>
            <Route path="/eventos" element={<Events />} />
            <Route path="/incluirevento" element={<EventsInclude />} />
            <Route path="/tipos" element={<Tipo />} />
          </Routes>
        </header>
      </div>
    </Router>


  );

};



export default App;
