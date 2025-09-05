import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'contact' | 'modal';
  firstName?: string;
  lastName?: string;
  phonePrefix?: string;
  phoneNumber?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get EmailJS configuration from Supabase secrets
    const serviceId = Deno.env.get("EMAILJS_SERVICE_ID");
    const templateId = Deno.env.get("EMAILJS_TEMPLATE_ID");
    const publicKey = Deno.env.get("EMAILJS_PUBLIC_KEY");

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS configuration not found in secrets");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestData: ContactEmailRequest = await req.json();
    const { name, email, phone, message, type, firstName, lastName, phonePrefix, phoneNumber } = requestData;

    // Prepare template parameters based on email type
    let templateParams;
    if (type === 'modal') {
      const fullName = `${firstName} ${lastName}`;
      const fullPhone = `${phonePrefix} ${phoneNumber}`;
      templateParams = {
        from_name: fullName,
        from_email: email,
        phone: fullPhone,
        message: message,
        to_email: 'atencioncliente.edp@gmail.com',
        reply_to: email
      };
    } else {
      templateParams = {
        title: "Contact Form",
        name: name,
        from_email: email,
        phone: phone,
        message: message,
        to_email: 'atencioncliente.edp@gmail.com',
        reply_to: email
      };
    }

    // Send email using EmailJS API directly
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      })
    });

    if (!emailResponse.ok) {
      throw new Error(`EmailJS API error: ${emailResponse.status} ${emailResponse.statusText}`);
    }

    console.log("Email sent successfully via secure edge function");

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);