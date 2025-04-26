import React from 'react';
import QuestionnaireSection from './QuestionnaireSection';

const QuestionnairePage = ({ darkMode }) => (
  <div className={darkMode ? 'bg-gray-900 min-h-screen' : 'bg-white min-h-screen'}>
    {/* You can add a header/nav here if you like */}
    <QuestionnaireSection darkMode={darkMode} />
  </div>
);

export default QuestionnairePage;