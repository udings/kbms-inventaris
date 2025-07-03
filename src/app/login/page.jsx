"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";  



function Login() {
   const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("/api/auth/login", { username, password });

    // Simpan token dan data user ke localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("role", res.data.role); // ⬅️ Tambahkan ini!

     alert("Login berhasil!");
      router.push("/item-list"); // Ganti dengan halaman setelah login
    } catch (err) {
      console.error("Login error:", err);
      alert("Login gagal. Periksa username dan password.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Username:</label>
          <input
            type="text"
            className="border w-full px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            className="border w-full px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
