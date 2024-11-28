import React, { useState, useEffect } from 'react';

const ContactForm = ({ onAdd, contact, showAlert }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (contact) {
            setName(contact.name);
            setEmail(contact.email);
            setPhone(contact.phone);
        } else {
            setName('');
            setEmail('');
            setPhone('');
        }
    }, [contact]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = contact ? 'PUT' : 'POST';
        const url = contact ? `/contacts/${contact.id}` : '/contacts';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                onAdd();
                setName('');
                setEmail('');
                setPhone('');
                showAlert(contact ? 'Contacto actualizado exitosamente' : 'Contacto agregado exitosamente', 'success');
            } else {
                showAlert(data.error || 'Error al guardar el contacto', 'error');
            }
        } catch (error) {
            showAlert('Error al procesar la solicitud', 'error');
        }
    };

    return (
        <div className="flex justify-center mb-4 mt-6">
            <form onSubmit={handleSubmit} className="flex space-x-2 w-full max-w-4xl">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required className="border p-2 w-full" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" required className="border p-2 w-full" />
                <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" className="border p-2 w-full" />
                <button type="submit" className={`p-2 ${!name || !email || !phone ? 'bg-gray-800' : 'bg-blue-500'} text-white`} disabled={!name || !email || !phone}>
                    {contact ? 'Editar Contacto' : 'Agregar Contacto'}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
