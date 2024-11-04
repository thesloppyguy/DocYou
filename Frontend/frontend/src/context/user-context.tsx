import { createContext, useContext } from "react";
import useUserStore from "../stores/userStore";

// Create a context
const UserContext = createContext(null);

// Custom hook to access user store context
export const useUserContext = () => {
  return useContext(UserContext);
};

// User provider component
const UserProvider = ({ children }) => {
  const store = useUserStore();
  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export default UserProvider;
