import React, { useState } from 'react';
import ContactForm from './ContactForm';

const ContactList = ({ contacts, onDelete, showAlert }) => {
    const [editingContact, setEditingContact] = useState(null);

    const handleDelete = async (id) => {
        await fetch(`/contacts/${id}`, { method: 'DELETE' });
        onDelete();
        showAlert('Contacto eliminado con éxito', 'success');
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
    };

    const handleFormSubmit = () => {
        setEditingContact(null);
        onDelete();
        showAlert('Contacto editado con éxito', 'success');
    };

    const downloadExcel = async () => {
        const response = await fetch('/export/excel');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contacts.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const downloadPDF = async () => {
        try {
            const response = await fetch('/export/pdf');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'contacts.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al descargar el PDF');
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-4">
                <ContactForm 
                    contact={editingContact} 
                    onAdd={handleFormSubmit} 
                    showAlert={showAlert} 
                />
                
                <div className="flex justify-center space-x-4 my-6">
                    <button 
                        onClick={downloadExcel} 
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exportar Excel
                    </button>
                    <button 
                        onClick={downloadPDF} 
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exportar PDF
                    </button>
                </div>

                {contacts.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Nombre</th>
                                <th className="py-2 px-4 border-b">Correo Electrónico</th>
                                <th className="py-2 px-4 border-b">Teléfono</th>
                                <th className="py-2 px-4 border-b">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(contact => (
                                <tr key={contact.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{contact.name}</td>
                                    <td className="py-2 px-4 border-b">{contact.email}</td>
                                    <td className="py-2 px-4 border-b">{contact.phone}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => handleDelete(contact.id)} className="bg-red-500 text-white p-1 rounded ml-2">Eliminar</button>
                                        <button onClick={() => handleEdit(contact)} className="bg-yellow-500 text-white p-1 rounded ml-2">Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-8 text-gray-600">
                        No hay contactos registrados actualmente.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactList;
