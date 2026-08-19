import { useState, useEffect } from 'react';
import userManagementClient from '../api/userManagementClient';

/**
 * Hook to fetch and cache organization data from User Management API
 * Usage:
 *   const { regions, taxCenters, users, teams, loading, error } = useOrgData();
 */
export function useOrgData() {
  const [regions, setRegions] = useState([]);
  const [taxCenters, setTaxCenters] = useState({});
  const [users, setUsers] = useState({});
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all regions
        const regionsList = await userManagementClient.listRegions();
        setRegions(regionsList);
        console.log('✓ Regions loaded:', regionsList.length);

        // Fetch tax centers for each region
        const taxCentersByRegion = {};
        for (const region of regionsList) {
          const tcs = await userManagementClient.getTaxCentersInRegion(region.code);
          taxCentersByRegion[region.code] = tcs;
        }
        setTaxCenters(taxCentersByRegion);
        console.log('✓ Tax centers loaded for all regions');

        // Fetch users and teams for each tax center
        const usersByTc = {};
        const teamsByTc = {};
        for (const region of regionsList) {
          const tcs = taxCentersByRegion[region.code];
          for (const tc of tcs) {
            const tcUsers = await userManagementClient.getUsersAtTaxCenter(tc.id);
            const tcTeams = await userManagementClient.getTeamsAtTaxCenter(tc.id);
            usersByTc[tc.id] = tcUsers;
            teamsByTc[tc.id] = tcTeams;
          }
        }
        setUsers(usersByTc);
        setTeams(teamsByTc);
        console.log('✓ Users and teams loaded for all tax centers');
      } catch (err) {
        setError(err.message);
        console.error('✗ Error fetching org data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();
  }, []);

  // Helper: Get tax centers for a specific region
  const getTaxCentersForRegion = (regionCode) => {
    return taxCenters[regionCode] || [];
  };

  // Helper: Get users at a tax center
  const getUsersAtTaxCenter = (taxCenterId) => {
    return users[taxCenterId] || [];
  };

  // Helper: Get teams at a tax center
  const getTeamsAtTaxCenter = (taxCenterId) => {
    return teams[taxCenterId] || [];
  };

  // Helper: Get users by role
  const getUsersByRole = (role, taxCenterId = null) => {
    if (taxCenterId) {
      const tcUsers = getUsersAtTaxCenter(taxCenterId);
      return tcUsers.filter((u) => u.role === role);
    }
    // Across all tax centers
    const allUsers = Object.values(users).flat();
    return allUsers.filter((u) => u.role === role);
  };

  // Helper: Get team members
  const getTeamMembers = (taxCenterId, teamId) => {
    const tcTeams = getTeamsAtTaxCenter(taxCenterId);
    const team = tcTeams.find((t) => t.id === teamId);
    return team ? team.members || [] : [];
  };

  return {
    regions,
    taxCenters,
    users,
    teams,
    loading,
    error,
    getTaxCentersForRegion,
    getUsersAtTaxCenter,
    getTeamsAtTaxCenter,
    getUsersByRole,
    getTeamMembers,
  };
}
