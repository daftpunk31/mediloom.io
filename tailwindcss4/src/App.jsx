import './index.css';
import Header from "./components/Header";
import Fotter from './components/Fotter';
import Contactus from "./components/Contactus";
import Aboutus from "./components/Aboutus";
import Home from './pages/Home';

//import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//import { useGSAP } from '@gsap/react'
import Loginpage from './pages/Loginpage';

import Patient from './pages/Patient';
import Docterpage from './pages/Docterpage';
import Uploadpage from './pages/Uploadpage';
import Resourcepage from './pages/Resourcepage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';


 const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/civilian" element={<Patient />} />
        <Route path="/doctor" element={<Docterpage />} />
        <Route path="/upload" element={<Uploadpage />} />
        <Route path="/resources" element={<Resourcepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      </>
    
   
  );
};

export default App;
