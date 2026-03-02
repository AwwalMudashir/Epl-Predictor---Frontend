import { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

let nextId = 1;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback((message, type = 'info', duration = 4000) => {
    const id = nextId++;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  const value = { notifications, notify };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
