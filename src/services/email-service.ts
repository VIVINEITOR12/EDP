// email-service.ts - Secure email service using Supabase edge function
import { supabase } from '@/integrations/supabase/client';

const TO_EMAIL = 'atencioncliente.edp@gmail.com';

interface EmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
  to_email: string;
}

interface EmailModalData {
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  message: string;
  to_email: string;
}

export class EmailService {
  private static instance: EmailService;
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendContactEmail(data: EmailData): Promise<boolean> {
    try {
      const { data: response, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          type: 'contact'
        },
      });

      if (error) {
        console.error('Error calling email function:', error);
        return false;
      }

      console.log('Email enviado exitosamente:', response);
      return true;
    } catch (error) {
      console.error('Error enviando email:', error);
      return false;
    }
  }

  async sendEmailModal(data: EmailModalData): Promise<boolean> {
    try {
      const { data: response, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          email: data.email,
          message: data.message,
          type: 'modal',
          firstName: data.firstName,
          lastName: data.lastName,
          phonePrefix: data.phonePrefix,
          phoneNumber: data.phoneNumber
        },
      });

      if (error) {
        console.error('Error calling email function:', error);
        return false;
      }

      console.log('Email modal enviado exitosamente:', response);
      return true;
    } catch (error) {
      console.error('Error enviando email modal:', error);
      return false;
    }
  }

  // Legacy method for compatibility - no longer needed with secure edge function
  configureEmailJS(serviceId: string, templateId: string, publicKey: string) {
    console.warn('EmailJS configuration is now handled securely via Supabase secrets');
  }

  // Always configured now since we use edge functions
  isConfigured(): boolean {
    return true;
  }
}

export const emailService = EmailService.getInstance();