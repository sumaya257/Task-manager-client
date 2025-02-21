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
            await axios.post("http://localhost:5000/added-user", {
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
                // Send a request to delete the user's data from the database
                await axios.delete("http://localhost:5000/delete-user", {
                    data: { uid: user.uid } // Sending the user's UID to delete their data
                });
            }
            await signOut(auth);
            setUser(null);
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
