import React from 'react';

const Navbar = ({ onLogout, isLoggedIn }) => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Sistema de gestión de contactos</h1>
            <div>
                {isLoggedIn && (
                    <button onClick={onLogout} className="mr-4 text-gray-700">Cerrar sesión</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
