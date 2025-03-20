import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Collaborator {
  userId: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  isOwner: boolean;
  user: User;
}

export function useCollaborators(tripId: string) {
  const { isAuthenticated } = useAuth();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborators = useCallback(async () => {
    if (!isAuthenticated || !tripId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/trips/${tripId}/collaborators`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch collaborators');
      }
      
      const result = await response.json();
      setCollaborators(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching collaborators:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tripId, isAuthenticated]);

  const addCollaborator = useCallback(
    async (email: string, role: 'EDITOR' | 'VIEWER') => {
      if (!isAuthenticated || !tripId) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trips/${tripId}/collaborators`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, role }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add collaborator');
        }
        
        const result = await response.json();
        
        // Add the new collaborator to the list
        setCollaborators((prevCollaborators) => [
          ...prevCollaborators,
          { ...result.data, isOwner: false },
        ]);
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error adding collaborator:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, isAuthenticated]
  );

  const removeCollaborator = useCallback(
    async (collaboratorId: string) => {
      if (!isAuthenticated || !tripId) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/trips/${tripId}/collaborators?collaboratorId=${collaboratorId}`,
          {
            method: 'DELETE',
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove collaborator');
        }
        
        // Remove the collaborator from the list
        setCollaborators((prevCollaborators) =>
          prevCollaborators.filter((c) => c.userId !== collaboratorId)
        );
        
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error removing collaborator:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, isAuthenticated]
  );

  return {
    collaborators,
    isLoading,
    error,
    fetchCollaborators,
    addCollaborator,
    removeCollaborator,
  };
} 