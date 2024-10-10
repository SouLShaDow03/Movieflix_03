import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { firebaseAuth } from "../firebase-config"; // Ensure firebaseAuth is imported

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialized as null to signify unknown state
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        // Set cookie for the user ID
        Cookies.set("user", uid, { expires: 7 }); // Optional: Set cookie expiry as needed

        // Fetch user profile from Firestore
        const userDoc = doc(db, "USERS", uid);
        const userDocRef = await getDoc(userDoc); // Await the getDoc call

        if (userDocRef.exists()) {
          const userData = userDocRef.data();
          setUserProfile(userData); // Set user profile data
          setIsAuthenticated(true);
          setIsAdmin(userData.isAdmin || false);
          console.log("User Data:", userData);
        } else {
          setIsAuthenticated(false);
          setUserProfile(null);
          setIsAdmin(false);
        }
      } else {
        // User is signed out
        setIsAuthenticated(false);
        setUserProfile(null);
        setIsAdmin(false);
        // Clear the cookie if the user is signed out
        Cookies.remove("user");
      }
      setIsLoading(false); // Loading complete
    });

    // Check for cookie if user is not authenticated yet
    const checkUserFromCookie = async () => {
      const uid = Cookies.get("user");
      if (uid) {
        setIsAuthenticated(true);
        // Fetch user profile from Firestore based on cookie
        const userDoc = doc(db, "USERS", uid);
        const userDocRef = await getDoc(userDoc); // Await the getDoc call

        if (userDocRef.exists()) {
          const userData = userDocRef.data();
          setUserProfile(userData); // Set user profile data
          setIsAdmin(userData.isAdmin || false);
        } else {
          setIsAuthenticated(false);
          setUserProfile(null);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
        setIsAdmin(false);
      }
    };

    checkUserFromCookie(); // Call the function to check for user from cookie

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        setIsAuthenticated,
        userProfile,
        setUserProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
