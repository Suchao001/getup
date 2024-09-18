import { useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from '../script/HostName';

const useFetchUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState('/path-to-default-avatar.jpg');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${HostName}/api/user/user_profile`, { withCredentials: true });
      setUserProfile(response.data.user);
      setAvatarSrc(response.data.user.img || '/path-to-default-avatar.jpg');
      setError(null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { userProfile, avatarSrc, loading, error, refetchUserProfile: fetchUserProfile };
};

export default useFetchUserProfile;