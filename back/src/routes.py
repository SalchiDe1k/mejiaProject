from flask import Blueprint, request, jsonify, send_file
from models import db, Contact
from auth import bp as auth_bp
import pandas as pd
from io import BytesIO
from fpdf import FPDF

bp = Blueprint('contacts', __name__)

@bp.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([{'id': c.id, 'name': c.name, 'email': c.email, 'phone': c.phone} for c in contacts])

@bp.route('/export/excel', methods=['GET'])
def export_contacts_to_excel():
    try:
        contacts = Contact.query.all()
        data = [{'Nombre': c.name, 'Correo': c.email, 'Teléfono': c.phone} for c in contacts]
        df = pd.DataFrame(data)
        
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Contactos')
        
        output.seek(0)
        
        response = send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='contacts.xlsx'
        )
        response.headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        return response
    except Exception as e:
        print(f"Error generating Excel: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/export/pdf', methods=['GET'])
def export_contacts_to_pdf():
    try:
        contacts = Contact.query.all()
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Configurar el encoding y márgenes
        pdf.set_auto_page_break(auto=True, margin=15)
        
        # Título
        pdf.cell(0, 10, 'Lista de Contactos', 0, 1, 'C')
        pdf.ln(10)
        
        # Encabezados
        pdf.set_fill_color(0, 137, 207)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(60, 10, 'Nombre', 1, 0, 'C', True)
        pdf.cell(70, 10, 'Correo', 1, 0, 'C', True)
        pdf.cell(60, 10, 'Telefono', 1, 1, 'C', True)
        
        # Restablecer color de texto para los datos
        pdf.set_text_color(0, 0, 0)
        
        # Datos
        for contact in contacts:
            pdf.cell(60, 10, str(contact.name)[:25], 1, 0, 'L')
            pdf.cell(70, 10, str(contact.email)[:30], 1, 0, 'L')
            pdf.cell(60, 10, str(contact.phone)[:15], 1, 1, 'L')
        
        # Guardar PDF en memoria
        pdf_content = pdf.output(dest='S').encode('latin-1')
        pdf_output = BytesIO(pdf_content)
        pdf_output.seek(0)
        
        return send_file(
            pdf_output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='contacts.pdf'
        )
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/contacts', methods=['POST'])
def add_contact():
    data = request.json
    
    # Verificar si ya existe un contacto con el mismo nombre
    existing_contact = Contact.query.filter_by(name=data['name']).first()
    if existing_contact:
        return jsonify({'error': 'Ya existe un contacto con ese nombre'}), 400
        
    try:
        new_contact = Contact(name=data['name'], email=data['email'], phone=data.get('phone'))
        db.session.add(new_contact)
        db.session.commit()
        return jsonify({'message': 'Contacto agregado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al guardar el contacto'}), 500

@bp.route('/contacts/<int:id>', methods=['PUT'])
def edit_contact(id):
    data = request.json
    contact = Contact.query.get(id)
    if contact:
        contact.name = data['name']
        contact.email = data['email']
        contact.phone = data.get('phone')
        db.session.commit()
        return jsonify({'message': 'Contact updated successfully'}), 200
    return jsonify({'message': 'Contact not found'}), 404

@bp.route('/contacts/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = Contact.query.get(id)
    if contact:
        db.session.delete(contact)
        db.session.commit()
        return jsonify({'message': 'Contact deleted successfully'}), 200
    return jsonify({'message': 'Contact not found'}), 404

def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(bp)
