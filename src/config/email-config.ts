/**
 * Email Configuration
 * 
 * This file contains the configuration for EmailJS service.
 * Replace these values with your actual EmailJS credentials.
 */

export const EMAIL_CONFIG = {
  // EmailJS Service Configuration
  EMAILJS_SERVICE_ID: 'service_cb19qov', // Replace with your EmailJS Service ID
  EMAILJS_TEMPLATE_ID: 'template_atdgmp8', // Replace with your EmailJS Template ID
  EMAILJS_PUBLIC_KEY: 'x-8OROWd1IpxSMrnO', // Replace with your EmailJS Public Key
  
  // Target email address
  TARGET_EMAIL: 'atencioncliente.edp@gmail.com',
  
  // Template variables
  TEMPLATE_VARIABLES: {
    to_email: 'atencioncliente.edp@gmail.com',
    from_name: '{{name}}',
    from_email: '{{email}}',
    phone: '{{phone}}',
    message: '{{message}}',
    subject: 'Nuevo mensaje desde EDP Diseños'
  }
};

// Instructions for setting up EmailJS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create a new service (Gmail is recommended)
// 3. Create a new email template with the following structure:
//    - To: {{to_email}}
//    - From: {{from_email}}
//    - Subject: {{subject}}
//    - Body: 
//      Nombre: {{from_name}}
//      Teléfono: {{phone}}
//      Mensaje: {{message}}
// 4. Copy your Service ID, Template ID, and Public Key
// 5. Update the EMAIL_CONFIG object above with your credentials
