import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export default function ToastContainer() {
  const { notifications } = useContext(NotificationContext);

  return (
    <div className="fixed top-4 right-4 space-y-3 z-50">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`max-w-xs w-full px-4 py-2 rounded shadow-lg text-white flex items-center justify-between transition-opacity duration-300
            ${n.type === 'error' ? 'bg-red-500' : n.type === 'success' ? 'bg-green-500' : 'bg-indigo-600'}`}
        >
          <span className="flex items-center flex-1 mr-2">
            {n.type === 'success' && <span className="mr-2">✅</span>}
            {n.type === 'error' && <span className="mr-2">⚠️</span>}
            {n.type === 'info' && <span className="mr-2">ℹ️</span>}
            {n.message}
          </span>
        </div>
      ))}
    </div>
  );
}
