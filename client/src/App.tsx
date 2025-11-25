import React, { useEffect, useState } from 'react';
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

  return <Sidebar sessions={sessions} userId={"456"}/>;
};

export default MainApp;
