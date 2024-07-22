import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { FaBars, FaTimes } from 'react-icons/fa';  // Add react-icons for the toggle icon

const eventCodes = [
  { code: 1, name: 'Process creation', description: 'A process was created.' },
  { code: 2, name: 'File creation time changed', description: 'The file creation time was changed.' },
  { code: 3, name: 'Network connection', description: 'A network connection was detected.' },
  // Add more Sysmon event codes and their descriptions here
];

const Sidebar = () => {
  const [expandedCode, setExpandedCode] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleToggleCode = (code) => {
    setExpandedCode(expandedCode === code ? null : code);
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen">
      <div className={`bg-gray-800 text-white transition-all duration-300 ${isSidebarVisible ? 'w-64 p-4' : 'w-12 p-2'} flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          {isSidebarVisible && <h2 className="text-xl font-bold">Sysmon Event Codes</h2>}
          <button onClick={handleToggleSidebar} className="focus:outline-none mt-2">
            {isSidebarVisible ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {isSidebarVisible && (
          <ul className="overflow-y-auto flex-grow">
            {eventCodes.map((event) => (
              <li key={event.code} className="mb-2">
                <div
                  className="cursor-pointer p-2 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={() => handleToggleCode(event.code)}
                >
                  {event.code} - {event.name}
                </div>
                <Collapse isOpened={expandedCode === event.code}>
                  <div className="p-2 text-sm bg-gray-900 rounded mt-1">
                    {event.description}
                  </div>
                </Collapse>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
