import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ContactList from './components/ContactList';
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });

    const fetchContacts = async () => {
        const response = await fetch('/contacts', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setContacts(data);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const showAlert = (message, type) => {
        setAlert({ message, type, visible: true });
        setTimeout(() => {
            setAlert({ ...alert, visible: false });
        }, 3000);
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchContacts();
        }
    }, [isLoggedIn]);

    return (
        <div className="container mx-auto p-4">
            <Navbar onLogout={handleLogout} isLoggedIn={isLoggedIn} />
            {alert.visible && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, visible: false })} />}
            {!isLoggedIn ? (
                <div className="flex mt-6 justify-center space-x-4">
                    <Login onLogin={() => setIsLoggedIn(true)} />
                    <Register />
                </div>
            ) : (
                <ContactList contacts={contacts} onDelete={fetchContacts} showAlert={showAlert} />
            )}
        </div>
    );
};

export default App;
