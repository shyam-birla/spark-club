// src/hooks/useTeamManagement.js

import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

const useTeamManagement = (dispatch) => {

  const handleLookupProfile = useCallback(async (uniqueProfileId, memberType, memberIndex = null) => {
    if (!uniqueProfileId) {
      toast.error('Please enter a Profile ID to look up.');
      return;
    }
    try {
      const response = await fetch('/api/profile/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueProfileId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Profile not found');
      }
      const profile = await response.json();
      if (memberIndex !== null) {
        dispatch({ type: 'UPDATE_TEAM_MEMBER', memberType, index: memberIndex, payload: { ...profile, profileId: profile._id } });
      } else {
        dispatch({ type: 'UPDATE_SOLO_CONTRIBUTOR', payload: { ...profile, profileId: profile._id } });
      }
      toast.success(`Found profile: ${profile.name}`);
    } catch (error) {
      toast.error(error.message);
    }
  }, [dispatch]);

  const addTeamMember = useCallback((newMember, memberType) => {
    dispatch({ type: 'ADD_TEAM_MEMBER', memberType, payload: { ...newMember, isNew: true } });
  }, [dispatch]);

  const removeTeamMember = useCallback((memberType, index) => {
    dispatch({ type: 'REMOVE_TEAM_MEMBER', memberType, index });
  }, [dispatch]);

  const handleTeamMemberChange = useCallback((memberType, index, field, value) => {
    dispatch({ type: 'UPDATE_TEAM_MEMBER', memberType, index, payload: { [field]: value } });
  }, [dispatch]);

  const handleSoloContributorChange = useCallback((field, value) => {
    dispatch({ type: 'UPDATE_SOLO_CONTRIBUTOR', payload: { [field]: value } });
  }, [dispatch]);

  return {
    handleLookupProfile,
    addTeamMember,
    removeTeamMember,
    handleTeamMemberChange,
    handleSoloContributorChange,
  };
};

export default useTeamManagement;

