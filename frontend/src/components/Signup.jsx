// import { signupUser } from "../services/api";

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await signupUser({
//       username,
//       email,
//       password,
//     });

//     console.log("Signup success:", res.data);
//     navigate("/login");
//   } catch (err) {
//     console.log(err.response?.data);
//     alert(err.response?.data?.message || "Signup failed");
//   }
// };
import { useState } from "react";
import { registerUser } from "../services/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser({
        username,
        email,
        password,
      });

      console.log("Signup success:", res.data);
      alert("Signup successful");
    } catch (err) {
      console.log("Signup error:", err.response?.data || err.message);
      alert("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
