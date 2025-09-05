# Guía de Configuración: Sincronización y Formulario de Contacto

## Resumen de Cambios Implementados

### ✅ Problema 1: Sincronización entre Panel de Administración y Tienda
**Solución**: Implementación de hook personalizado `useSiteConfig` que sincroniza datos en tiempo real desde Supabase.

### ✅ Problema 2: Formulario de Contacto
**Solución**: Integración con EmailJS para envío real de correos a atencioncliente.edp@gmail.com

## Archivos Creados y Modificados

### Nuevos Archivos:
- `src/hooks/use-site-config.ts` - Hook para sincronización en tiempo real
- `src/services/email-service.ts` - Servicio de envío de correos
- `src/config/email-config.ts` - Configuración de EmailJS
- `src/components/ui/footer-updated.tsx` - Footer con datos dinámicos
- `src/components/contact/contact-section-updated.tsx` - Sección de contacto con datos dinámicos
- `src/components/contact/email-modal-updated.tsx` - Modal de email con integración real
- `src/integrations/site-config-integration.ts` - Guía de integración completa

## Pasos de Instalación

### 1. Configuración de Base de Datos (Supabase)

Ejecuta el siguiente SQL en tu proyecto Supabase:

```sql
-- Crear tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar valores por defecto
INSERT INTO site_config (key, value) VALUES
  ('contact_phone', '+58 424 953 9367'),
  ('contact_email', 'atencioncliente.edp@gmail.com'),
  ('contact_address', 'Venezuela, Monagas, Maturín'),
  ('social_whatsapp', 'https://wa.me/584249539367'),
  ('social_instagram', 'https://instagram.com/edp.disenos'),
  ('social_facebook', 'https://facebook.com/edp.disenos')
ON CONFLICT (key) DO NOTHING;
```

### 2. Configuración de EmailJS

1. **Crear cuenta en EmailJS**:
   - Ve a https://www.emailjs.com/
   - Crea una cuenta gratuita

2. **Configurar servicio de email**:
   - Ve a "Email Services"
   - Crea un nuevo servicio (recomendado: Gmail)
   - Copia el "Service ID"

3. **Crear plantilla de email**:
   - Ve a "Email Templates"
   - Crea una nueva plantilla con estos campos:
     ```
     To: {{to_email}}
     From: {{from_email}}
     Subject: Nuevo mensaje desde EDP Diseños - {{from_name}}
     
     Nombre: {{from_name}}
     Email: {{from_email}}
     Teléfono: {{phone}}
     Mensaje: {{message}}
     ```
   - Copia el "Template ID"

4. **Obtener clave pública**:
   - Ve a "Account" → "General"
   - Copia la "Public Key"

### 3. Actualizar Configuración

Edita `src/config/email-config.ts` con tus credenciales:

```typescript
export const EMAIL_CONFIG = {
  EMAILJS_SERVICE_ID: 'tu_service_id_aqui',
  EMAILJS_TEMPLATE_ID: 'tu_template_id_aqui',
  EMAILJS_PUBLIC_KEY: 'tu_public_key_aqui',
  TARGET_EMAIL: 'atencioncliente.edp@gmail.com',
  // ... resto de la configuración
};
```

### 4. Reemplazar Componentes

#### Actualizar Footer
Reemplaza las importaciones en tus páginas:

```typescript
// Antes
import { Footer } from "@/components/ui/footer";

// Después
import { FooterUpdated } from "@/components/ui/footer-updated";
```

#### Actualizar Sección de Contacto
```typescript
// Antes
import { ContactSection } from "@/components/contact/contact-section";

// Después
import { ContactSectionUpdated } from "@/components/contact/contact-section-updated";
```

### 5. Verificación de Funcionamiento

#### Prueba de Sincronización:
1. Ve al panel de administración
2. Cambia la información de contacto
3. Verifica que los cambios se reflejan inmediatamente en el footer y sección de contacto

#### Prueba de Formulario:
1. Completa el formulario de contacto
2. Verifica que el email llega a atencioncliente.edp@gmail.com
3. Confirma que el mensaje contiene toda la información correcta

## Estructura de Datos

La tabla `site_config` almacena estos campos:
- `contact_phone`: Teléfono de contacto
- `contact_email`: Email de contacto (atencioncliente.edp@gmail.com)
- `contact_address`: Dirección física
- `social_whatsapp`: Link de WhatsApp
- `social_instagram`: Link de Instagram
- `social_facebook`: Link de Facebook

## Solución de Problemas Comunes

### Si los cambios no se sincronizan:
1. Verifica que la tabla `site_config` existe en Supabase
2. Confirma que tienes permisos de lectura en la tabla
3. Revisa la consola del navegador por errores

### Si los emails no llegan:
1. Verifica la configuración de EmailJS
2. Confirma que el email destino es correcto
3. Revisa la carpeta de spam
4. Verifica los límites de EmailJS (200 emails/mes en plan gratuito)

## Soporte Técnico

Para problemas adicionales:
1. Revisa la consola del navegador
2. Verifica los logs de Supabase
3. Contacta al equipo de desarrollo con los errores específicos
