/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import axios from "axios"; // Assuming you use Axios for API requests
import { app } from "../firebase/firebase.config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const { uid, email, displayName } = result.user;
            setUser({ uid, email, displayName });
            
            // Store user details in the database upon first login
            await axios.post("https://task-manager-server-psi-red.vercel.app/added-user", {
                uid,
                email,
                displayName,
            });
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    const logout = async () => {
        try {
            if (user) {
                // Just sign out the user, no need to delete data
                await signOut(auth);
                setUser(null);  // Clear the user state
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
