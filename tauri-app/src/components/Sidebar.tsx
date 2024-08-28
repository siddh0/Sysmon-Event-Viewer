import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { FaBars, FaTimes } from 'react-icons/fa';

const eventCodes = [
  { code: 1, name: 'Process creation', description: 'A process was created with detailed information about its execution.' },
  { code: 2, name: 'File creation time changed', description: 'The creation time of a file was modified, which may indicate tampering.' },
  { code: 3, name: 'Network connection', description: 'Logs details of TCP/UDP connections including IP addresses and port numbers.' },
  { code: 4, name: 'Sysmon service state changed', description: 'Reports when the Sysmon service starts or stops.' },
  { code: 5, name: 'Process terminated', description: 'Logs when a process terminates, including its GUID and ID.' },
  { code: 6, name: 'Driver loaded', description: 'Provides information about loaded drivers, including hashes and signatures.' },
  { code: 7, name: 'Image loaded', description: 'Logs module loading events in processes, including hashes and signatures.' },
  { code: 8, name: 'CreateRemoteThread', description: 'Detects when a process creates a thread in another process, often used for code injection.' },
  { code: 9, name: 'RawAccessRead', description: 'Logs reading operations from the drive using \\.\ notation, often used for data exfiltration.' },
  { code: 10, name: 'ProcessAccess', description: 'Logs when a process opens another process, useful for detecting memory reading attacks.' },
  { code: 11, name: 'File create', description: 'Records file creation or overwriting events, useful for monitoring autostart locations.' },
  { code: 12, name: 'Registry Event (Object create/delete)', description: 'Logs creation and deletion of registry keys and values.' },
  { code: 13, name: 'Registry Event (Value Set)', description: 'Records modifications to DWORD and QWORD registry values.' },
  { code: 14, name: 'Registry Event (Key/Value Rename)', description: 'Logs renaming of registry keys and values.' },
  { code: 15, name: 'File create stream hash', description: 'Logs when a named file stream is created, including hash information.' },
  { code: 16, name: 'Service configuration change', description: 'Records changes to Sysmon configuration.' },
  { code: 17, name: 'Pipe Event (Pipe Created)', description: 'Logs creation of named pipes, often used for interprocess communication.' },
  { code: 18, name: 'Pipe Event (Pipe Connected)', description: 'Records named pipe connections between clients and servers.' },
  { code: 19, name: 'WMI Event (Filter activity detected)', description: 'Logs registration of WMI filters, used by malware for execution.' },
  { code: 20, name: 'WMI Event (Consumer activity detected)', description: 'Logs registration of WMI consumers.' },
  { code: 21, name: 'WMI Event (ConsumerToFilter activity detected)', description: 'Logs when a WMI consumer binds to a filter.' },
  { code: 22, name: 'DNS Event (DNS query)', description: 'Records DNS queries and their results.' },
  { code: 23, name: 'File Delete (Archived)', description: 'Logs file deletions and saves deleted files in an archive directory.' },
  { code: 24, name: 'Clipboard Change', description: 'Logs changes to system clipboard contents.' },
  { code: 25, name: 'Process Tampering', description: 'Detects process image changes, often used for process hiding techniques.' },
  { code: 26, name: 'File Delete Detected', description: 'Logs file deletions without saving the file in an archive.' },
  { code: 27, name: 'File Block Executable', description: 'Logs detection and blocking of executable file creation.' },
  { code: 28, name: 'File Block Shredding', description: 'Logs detection and blocking of file shredding attempts.' },
  { code: 29, name: 'File Executable Detected', description: 'Logs detection of new executable file creation.' },
  { code: 255, name: 'Error', description: 'Logs errors within Sysmon, which may indicate performance issues or bugs.' },
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
      <div className={`bg-gray-800 text-white transition-all duration-300 ${isSidebarVisible ? 'w-64 p-4' : 'w-16 p-2'} flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          {isSidebarVisible && <h2 className="text-xl font-bold">Sysmon Event Codes</h2>}
          <button onClick={handleToggleSidebar} className="focus:outline-none mt-2">
            {isSidebarVisible ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {isSidebarVisible && (
          <ul className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
            {eventCodes.map((event) => (
              <li key={event.code} className="mb-2">
                <div
                  className="cursor-pointer p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
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
