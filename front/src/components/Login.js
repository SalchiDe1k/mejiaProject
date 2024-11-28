import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            onLogin();
            setUsername('');
            setPassword('');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl mb-4 text-center">Login</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="border p-2 mb-2 w-full"
            />
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="border p-2 mb-4 w-full"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2"
                >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
        </form>
    );
};

export default Login;
