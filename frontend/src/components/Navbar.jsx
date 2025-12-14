import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <Link to="/">Feed</Link> |{" "}
            {user ? (
                <>
                    <Link to={`/profile/${user._id}`}>Profile</Link> | 
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link> | 
                    <Link to="/signup">Signup</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
