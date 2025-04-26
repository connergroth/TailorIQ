import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

export function useAuth() {
  return useContext(UserContext);
}