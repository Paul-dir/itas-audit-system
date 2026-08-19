import { useData } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import * as businessLogic from '../utils/businessLogic';

/**
 * React Hook wrapper for business logic.
 * This provides a bridge between React Context (data, auth) 
 * and the vanilla JavaScript domain logic in businessLogic.js.
 * 
 * Since dataService now automatically listens for 'local-data-updated' 
 * events emitted by businessLogic.js, calling these functions will 
 * automatically trigger React state updates and UI re-renders!
 */
export function useBusinessLogic() {
  const { data, updateData, refreshData } = useData();
  const { getUserInfo, authContext } = useAuth();

  // You can wrap specific business logic functions here if they need 
  // direct access to React context (like the current user).
  // Otherwise, we export all standard business logic functions.

  return {
    ...businessLogic,
    
    // Example of wrapping a function to automatically use the logged-in user:
    submitRegionalFeedbackWithUser: (planId, region, feedback, taxCenterFeedbackArray) => {
      const userInfo = getUserInfo();
      // Add user info to feedback if needed in the future
      const result = businessLogic.submitRegionalFeedback(planId, region, feedback, taxCenterFeedbackArray);
      return result;
    }
  };
}

export default useBusinessLogic;
