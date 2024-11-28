import pandas as pd
from flask import send_file

def export_contacts_to_excel():
    contacts = Contact.query.all()
    data = [{'Name': c.name, 'Email': c.email, 'Phone': c.phone} for c in contacts]
    df = pd.DataFrame(data)
    df.to_excel('contacts.xlsx', index=False)
    return send_file('contacts.xlsx', as_attachment=True)
