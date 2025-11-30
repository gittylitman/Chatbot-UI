<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import ClosedSidebar from './components/sidebar/ClosedSidebar';
import Sidebar, { SessionItem } from './components/sideBar/SideBar';
const MainApp: React.FC = () => {
    const [sessions, setSessions] = useState<SessionItem[]>([]);


    useEffect(() => {
      const mock = [
        {
          id: "session_686af84bc0444adfb2257b390beee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },
        {
          id: "session_686af84bc0444adfb2257b390beee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },
        {
          id: "686af84bc0444adfb257b390beee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },
        {
          id: "686af84bc0444adfb2257b390beee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },
        {
          id: "686af84bc0444adfb2257b39eee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },
        {
          id: "686af84bc0444adfb2257b30beee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },  {
          id: "686af84bc0444adfb2257b390bee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },
        {
          id: "686af84bc0444adfb2257b390beee9277",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },  {
          id: "686af84bc0444adfb2257b390beee921",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },  {
          id: "686af84bc0444adfb2257b390bee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },  {
          id: "686af84bc0444adfb2257b390bee929",
          createdAt: "2025-11-23T06:56:01.935163Z"
        },  {
          id: "686af84bc0444adfb2257b390beee92",
          createdAt: "2025-11-23T06:56:01.935163Z"
        }
      ];
      setSessions(mock);
    }, []);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };
    return <>
    {isSidebarOpen ? (
                <Sidebar onToggle={handleToggleSidebar} sessions={sessions} />
            ) : (
                <ClosedSidebar onToggle={handleToggleSidebar} sessions={sessions}/>
            )}
    </>
=======
import Chatbot from './components/Chatbot';

const MainApp: React.FC = () => {
    return <Chatbot />;
>>>>>>> 4a364c26d71db669cda48a070324e6fe16b9107d
};

export default MainApp;
