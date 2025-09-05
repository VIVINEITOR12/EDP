/**
 * Site Configuration Integration Guide
 * 
 * This file provides the complete integration steps for:
 * 1. Synchronization between admin panel and store
 * 2. Contact form email delivery
 * 3. Real-time updates
 */

import { useSiteConfig } from "@/hooks/use-site-config";
import { emailService } from "@/services/email-service";

// Export all components and hooks for easy import
export { useSiteConfig } from "@/hooks/use-site-config";
export { emailService } from "@/services/email-service";

// Updated components
export { FooterUpdated } from "@/components/ui/footer-updated";
export { ContactSectionUpdated } from "@/components/contact/contact-section-updated";
export { EmailModalUpdated } from "@/components/contact/email-modal-updated";

// EmailJS Configuration
export const configureEmailService = (serviceId: string, templateId: string, publicKey: string) => {
  emailService.configureEmailJS(serviceId, templateId, publicKey);
};

// Migration steps for existing components
export const migrationSteps = {
  footer: {
    old: "src/components/ui/footer.tsx",
    new: "src/components/ui/footer-updated.tsx",
    changes: [
      "Import useSiteConfig hook",
      "Replace hard-coded contact info with dynamic config",
      "Update social media links to use config",
      "Update EmailModal to use updated version"
    ]
  },
  contactSection: {
    old: "src/components/contact/contact-section.tsx",
    new: "src/components/contact/contact-section-updated.tsx",
    changes: [
      "Import useSiteConfig hook",
      "Replace hard-coded contact info with dynamic config",
      "Integrate email service for form submission"
    ]
  },
  emailModal: {
    old: "src/components/contact/email-modal.tsx",
    new: "src/components/contact/email-modal-updated.tsx",
    changes: [
      "Add config prop for dynamic email",
      "Integrate email service for form submission",
      "Update form handling"
    ]
  }
};

// EmailJS Setup Instructions
export const emailJSInstructions = `
1. Create a free account at https://www.emailjs.com/
2. Create a new service (Gmail recommended)
3. Create a new email template with these variables:
   - to_email: atencioncliente.edp@gmail.com
   - from_name: {{name}}
   - from_email: {{email}}
   - phone: {{phone}}
   - message: {{message}}
4. Get your Service ID, Template ID, and Public Key
5. Configure the service in your app
`;

// Database setup for site_config table
export const databaseSetup = `
-- Ensure site_config table exists
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default values
INSERT INTO site_config (key, value) VALUES
  ('contact_phone', '+58 424 953 9367'),
  ('contact_email', 'atencioncliente.edp@gmail.com'),
  ('contact_address', 'Venezuela, Monagas, Maturín'),
  ('social_whatsapp', 'https://wa.me/584249539367'),
  ('social_instagram', 'https://instagram.com/edp.disenos'),
  ('social_facebook', 'https://facebook.com/edp.disenos')
ON CONFLICT (key) DO NOTHING;
`;
