import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
// import { GoogleAuthProvider } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getUserPrivileges } from "../firebase/firestore/authentication";
import { isAdmin } from '../firebase/firestore/authentication';

const AuthContext = React.createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userPrivileges, setUserPrivileges] = useState(null)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {

      setCurrentUser({ ...user });
      setUserPrivileges(await getUserPrivileges(user))
      setIsAdminUser(isAdmin(await getUserPrivileges(user)))

      // check if provider is email and password login
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      // check if the auth provider is google or not
      //   const isGoogle = user.providerData.some(
      //     (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
      //   );
      //   setIsGoogleUser(isGoogle);

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    userPrivileges,
    isAdminUser,
    setCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}