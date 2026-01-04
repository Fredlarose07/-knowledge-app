/**
 * App.tsx - Test de la Sidebar menu de navigation
 */

import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  const [activeSection, setActiveSection] = useState('notes');

  return (
    <div className="h-screen flex bg-gradient-to-b from-[#08090A] to-[#101011]">
      {/* Sidebar menu */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Zone principale */}
      <main className="flex-1 flex items-center justify-center text-neutral-500">
        <div className="text-center">
          <p className="text-15 mb-2">Section active : <span className="text-neutral-0 font-bold">{activeSection}</span></p>
          <p className="text-13 text-neutral-600">
            Clique sur Notes / Mocs / Schemas dans le menu 👈
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;