import { useState, useEffect } from 'react';

export const useSession = () => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const existingSession = localStorage.getItem('quiz_session_id');
    if (existingSession) {
      setSessionId(existingSession);
    } else {
      const newSession = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('quiz_session_id', newSession);
      setSessionId(newSession);
    }
  }, []);

  const clearSession = () => {
    localStorage.removeItem('quiz_session_id');
    setSessionId(null);
  };

  const generateNewSession = () => {
    const newSession = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('quiz_session_id', newSession);
    setSessionId(newSession);
    return newSession;
  };

  return { sessionId, clearSession, generateNewSession };
};