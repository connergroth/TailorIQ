import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import TailorIQLandingPage from './landingPage';
import QuestionnaireSection from './components/questionnaire';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <TailorIQLandingPage /> */}
    <QuestionnaireSection />
  </React.StrictMode>
);
