// export const htmlWelcomeContent = (usuario = "Usuario") => {
//   return `
// <!DOCTYPE html>
// <html lang="es">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Bienvenido a Pyme</title>
// </head>
// <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: Arial, sans-serif;">
//     <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa;">
//         <tr>
//             <td align="center" style="padding: 20px 0;">
//                 <!-- Contenedor principal -->
//                 <table width="600" border="0" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
//                     <!-- Header -->
//                     <tr>
//                         <td style="background: linear-gradient(135deg, #4a6fff 0%, #2a56d6 100%); padding: 30px 40px; text-align: center; color: white;">
//                             <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px;">PYME</div>
//                             <div style="font-size: 16px; font-weight: 300; opacity: 0.9;">Impulsando el crecimiento de tu negocio</div>
//                         </td>
//                     </tr>

//                     <!-- Contenido -->
//                     <tr>
//                         <td style="padding: 40px;">
//                             <h1 style="font-size: 28px; color: #2d3748; margin-bottom: 20px; text-align: center; font-weight: 600;">
//                                 ¡Bienvenido, <span style="color: #4a6fff;">${usuario}</span>!
//                             </h1>

//                             <p style="color: #4a5568; line-height: 1.6; margin-bottom: 30px; text-align: center; font-size: 16px;">
//                                 Nos alegra enormemente que te hayas unido a nuestra comunidad. En Pyme estamos comprometidos con el éxito de tu negocio y queremos ser tu aliado financiero en este viaje.
//                             </p>

//                             <!-- Características -->
//                             <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
//                                 <tr>
//                                     <td width="48%" style="background: #f7f9fc; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #e2e8f0;">
//                                         <div style="font-size: 24px; margin-bottom: 10px;">🚀</div>
//                                         <h3 style="font-weight: 600; color: #2d3748; margin-bottom: 8px; font-size: 16px;">Préstamos Rápidos</h3>
//                                         <p style="font-size: 14px; color: #718096;">Aprobación en 24 horas con tasas competitivas</p>
//                                     </td>
//                                     <td width="4%"></td>
//                                     <td width="48%" style="background: #f7f9fc; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #e2e8f0;">
//                                         <div style="font-size: 24px; margin-bottom: 10px;">🛡️</div>
//                                         <h3 style="font-weight: 600; color: #2d3748; margin-bottom: 8px; font-size: 16px;">Seguridad Garantizada</h3>
//                                         <p style="font-size: 14px; color: #718096;">Tus datos y transacciones están protegidos</p>
//                                     </td>
//                                 </tr>
//                                 <tr><td colspan="3" style="height: 15px;"></td></tr>
//                                 <tr>
//                                     <td width="48%" style="background: #f7f9fc; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #e2e8f0;">
//                                         <div style="font-size: 24px; margin-bottom: 10px;">💼</div>
//                                         <h3 style="font-weight: 600; color: #2d3748; margin-bottom: 8px; font-size: 16px;">Asesoría Personalizada</h3>
//                                         <p style="font-size: 14px; color: #718096;">Expertos dedicados a tu crecimiento</p>
//                                     </td>
//                                     <td width="4%"></td>
//                                     <td width="48%" style="background: #f7f9fc; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #e2e8f0;">
//                                         <div style="font-size: 24px; margin-bottom: 10px;">📈</div>
//                                         <h3 style="font-weight: 600; color: #2d3748; margin-bottom: 8px; font-size: 16px;">Seguimiento Continuo</h3>
//                                         <p style="font-size: 14px; color: #718096;">Monitorea el progreso de tu negocio</p>
//                                     </td>
//                                 </tr>
//                             </table>

//                             <!-- Botón CTA -->
//                             <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
//                                 <tr>
//                                     <td align="center">
//                                         <a href="#" style="display: inline-block; background: linear-gradient(135deg, #4a6fff 0%, #2a56d6 100%); color: white; padding: 16px 30px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(74, 111, 255, 0.3);">
//                                             Acceder a Mi Cuenta
//                                         </a>
//                                     </td>
//                                 </tr>
//                             </table>

//                             <!-- Pasos -->
//                             <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
//                                 <!-- Paso 1 -->
//                                 <tr>
//                                     <td style="background: #f7f9fc; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
//                                         <table width="100%" border="0" cellpadding="0" cellspacing="0">
//                                             <tr>
//                                                 <td width="36" valign="top">
//                                                     <div style="background: #4a6fff; color: white; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: 600;">1</div>
//                                                 </td>
//                                                 <td style="padding-left: 15px;">
//                                                     <h3 style="font-size: 16px; color: #2d3748; margin: 0 0 5px 0;">Completa tu perfil</h3>
//                                                     <p style="font-size: 14px; color: #718096; margin: 0;">Añade información sobre tu negocio para ofrecerte mejores opciones</p>
//                                                 </td>
//                                             </tr>
//                                         </table>
//                                     </td>
//                                 </tr>
//                                 <!-- Paso 2 -->
//                                 <tr>
//                                     <td style="background: #f7f9fc; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
//                                         <table width="100%" border="0" cellpadding="0" cellspacing="0">
//                                             <tr>
//                                                 <td width="36" valign="top">
//                                                     <div style="background: #4a6fff; color: white; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: 600;">2</div>
//                                                 </td>
//                                                 <td style="padding-left: 15px;">
//                                                     <h3 style="font-size: 16px; color: #2d3748; margin: 0 0 5px 0;">Explora nuestras opciones</h3>
//                                                     <p style="font-size: 14px; color: #718096; margin: 0;">Descubre los préstamos y servicios adaptados a tus necesidades</p>
//                                                 </td>
//                                             </tr>
//                                         </table>
//                                     </td>
//                                 </tr>
//                                 <!-- Paso 3 -->
//                                 <tr>
//                                     <td style="background: #f7f9fc; border-radius: 12px; padding: 15px;">
//                                         <table width="100%" border="0" cellpadding="0" cellspacing="0">
//                                             <tr>
//                                                 <td width="36" valign="top">
//                                                     <div style="background: #4a6fff; color: white; width: 36px; height: 36px; border-radius: 50%; text-align: center; line-height: 36px; font-weight: 600;">3</div>
//                                                 </td>
//                                                 <td style="padding-left: 15px;">
//                                                     <h3 style="font-size: 16px; color: #2d3748; margin: 0 0 5px 0;">Solicita tu primer préstamo</h3>
//                                                     <p style="font-size: 14px; color: #718096; margin: 0;">Inicia el proceso con solo unos clics y recibe respuesta rápida</p>
//                                                 </td>
//                                             </tr>
//                                         </table>
//                                     </td>
//                                 </tr>
//                             </table>
//                         </td>
//                     </tr>

//                     <!-- Footer -->
//                     <tr>
//                         <td style="background: #f7f9fc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
//                             <!-- Iconos sociales -->
//                             <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
//                                 <tr>
//                                     <td style="padding: 0 8px;">
//                                         <a href="#" style="display: inline-block; width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; color: #4a5568; text-decoration: none; text-align: center; line-height: 40px;">f</a>
//                                     </td>
//                                     <td style="padding: 0 8px;">
//                                         <a href="#" style="display: inline-block; width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; color: #4a5568; text-decoration: none; text-align: center; line-height: 40px;">in</a>
//                                     </td>
//                                     <td style="padding: 0 8px;">
//                                         <a href="#" style="display: inline-block; width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; color: #4a5568; text-decoration: none; text-align: center; line-height: 40px;">t</a>
//                                     </td>
//                                     <td style="padding: 0 8px;">
//                                         <a href="#" style="display: inline-block; width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; color: #4a5568; text-decoration: none; text-align: center; line-height: 40px;">ig</a>
//                                     </td>
//                                 </tr>
//                             </table>

//                             <!-- Enlaces footer -->
//                             <div style="margin: 20px 0;">
//                                 <a href="#" style="color: #4a5568; text-decoration: none; margin: 0 10px; font-size: 14px;">Términos y Condiciones</a>
//                                 <a href="#" style="color: #4a5568; text-decoration: none; margin: 0 10px; font-size: 14px;">Política de Privacidad</a>
//                                 <a href="#" style="color: #4a5568; text-decoration: none; margin: 0 10px; font-size: 14px;">Centro de Ayuda</a>
//                                 <a href="#" style="color: #4a5568; text-decoration: none; margin: 0 10px; font-size: 14px;">Contáctanos</a>
//                             </div>

//                             <!-- Copyright -->
//                             <div style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
//                                 © 2023 Pyme. Todos los derechos reservados.
//                             </div>
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//     </table>
// </body>
// </html>
//     `;
// };

export const htmlWelcomeContent = (code: string) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu email - Pyme</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: Arial, sans-serif;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <h1 style="color: #4a6fff; font-size: 28px; margin: 0 0 20px 0;">¡Bienvenido a Pyme!</h1>
                            <p style="color: #4a5568; font-size: 16px; margin: 0 0 30px 0; line-height: 1.6;">
                                Para completar tu registro, verifica tu email usando el siguiente código:
                            </p>
                            <div style="background: #f7f9fc; border: 2px dashed #4a6fff; border-radius: 8px; padding: 20px; margin: 30px 0;">
                                <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">Tu código de verificación:</p>
                                <p style="color: #4a6fff; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${code}</p>
                            </div>
                            <p style="color: #718096; font-size: 14px; margin: 20px 0 0 0;">
                                Este código expirará en <strong>1 hora</strong>.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background: #f7f9fc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2025 Pyme. Todos los derechos reservados.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

export const htmlResetPasswordContent = (
  resetUrl: string,
  userName = "Usuario"
) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña - Pyme</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: Arial, sans-serif;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" border="0" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #4a6fff 0%, #2a56d6 100%); padding: 30px 40px; text-align: center; color: white;">
                            <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px;">PYME</div>
                            <div style="font-size: 16px; font-weight: 300; opacity: 0.9;">Recuperación de Contraseña</div>
                        </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="font-size: 24px; color: #2d3748; margin-bottom: 20px; text-align: center; font-weight: 600;">
                                Hola, ${userName}
                            </h1>
                            
                            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.
                            </p>

                            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
                                Para restablecer tu contraseña, haz clic en el siguiente botón:
                            </p>
                            
                            <!-- Botón CTA -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #4a6fff 0%, #2a56d6 100%); color: white; padding: 16px 30px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(74, 111, 255, 0.3);">
                                            Restablecer Contraseña
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alerta de seguridad -->
                            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por seguridad. Si el enlace expira, deberás solicitar uno nuevo.
                                </p>
                            </div>

                            <p style="color: #718096; font-size: 14px; line-height: 1.5; margin-top: 30px;">
                                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                            </p>
                            <p style="word-break: break-all; color: #4a6fff; font-size: 14px; background: #f7f9fc; padding: 10px; border-radius: 4px;">
                                ${resetUrl}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f7f9fc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                                Si no solicitaste restablecer tu contraseña, contacta a nuestro equipo de soporte de inmediato.
                            </p>
                            <div style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                                © 2025 Pyme. Todos los derechos reservados.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

// Configuración de colores por estado
const statusColorConfig: Record<string, { primary: string; secondary: string; emoji: string; title: string }> = {
  'Aprobado': { 
    primary: '#10b981', 
    secondary: '#059669', 
    emoji: '✅', 
    title: '¡Felicitaciones! Tu crédito ha sido aprobado' 
  },
  'Rechazado': { 
    primary: '#ef4444', 
    secondary: '#dc2626', 
    emoji: '❌', 
    title: 'Actualización sobre tu solicitud de crédito' 
  },
  'En revisión': { 
    primary: '#3b82f6', 
    secondary: '#2563eb', 
    emoji: '🔍', 
    title: 'Tu crédito está siendo revisado' 
  },
  'Documentos requeridos': { 
    primary: '#f59e0b', 
    secondary: '#d97706', 
    emoji: '📄', 
    title: 'Se requieren documentos adicionales' 
  },
  'Desembolsado': { 
    primary: '#10b981', 
    secondary: '#047857', 
    emoji: '💰', 
    title: '¡Tu crédito ha sido desembolsado!' 
  },
  'Pendiente': { 
    primary: '#8b5cf6', 
    secondary: '#7c3aed', 
    emoji: '⏳', 
    title: 'Tu solicitud está en proceso' 
  }
};

/**
 * Genera el contenido HTML para el email de cambio de estado de crédito
 */
export const htmlLoanStatusUpdate = (
  userName: string,
  companyName: string,
  applicationNumber: string,
  newStatus: string,
  amount: number,
  statusReason?: string,
  frontendUrl: string = process.env.FRONTEND_URL || 'http://localhost:5173'
): string => {
  const config = statusColorConfig[newStatus] || statusColorConfig['Pendiente'];
  const formattedAmount = new Intl.NumberFormat('es-AR', { 
    style: 'currency', 
    currency: 'ARS' 
  }).format(amount);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de Estado - Crédito ${applicationNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellpadding="0" cellspacing="0" style="background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden; max-width: 100%;">
                    
                    <!-- Header con gradiente dinámico -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${config.primary} 0%, ${config.secondary} 100%); padding: 50px 40px; text-align: center;">
                            <div style="font-size: 60px; margin-bottom: 15px;">${config.emoji}</div>
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                ${config.title}
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #2d3748; font-size: 18px; margin: 0 0 10px 0; font-weight: 600;">
                                Hola ${userName},
                            </p>
                            
                            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
                                Te informamos que el estado de tu solicitud de crédito ha sido actualizado.
                            </p>

                            <!-- Card de información del crédito -->
                            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-left: 4px solid ${config.primary}; border-radius: 12px; padding: 25px; margin: 30px 0;">
                                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                                    📋 Detalles de la Solicitud
                                </h3>
                                
                                <table width="100%" border="0" cellpadding="8" cellspacing="0">
                                    <tr>
                                        <td style="color: #718096; font-size: 14px; padding: 8px 0;">
                                            <strong>Empresa:</strong>
                                        </td>
                                        <td style="color: #2d3748; font-size: 14px; text-align: right; padding: 8px 0;">
                                            ${companyName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #718096; font-size: 14px; padding: 8px 0; border-top: 1px solid #e2e8f0;">
                                            <strong>N° de Solicitud:</strong>
                                        </td>
                                        <td style="color: #2d3748; font-size: 14px; text-align: right; padding: 8px 0; border-top: 1px solid #e2e8f0;">
                                            ${applicationNumber}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #718096; font-size: 14px; padding: 8px 0; border-top: 1px solid #e2e8f0;">
                                            <strong>Monto:</strong>
                                        </td>
                                        <td style="color: #2d3748; font-size: 16px; font-weight: 600; text-align: right; padding: 8px 0; border-top: 1px solid #e2e8f0;">
                                            ${formattedAmount}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #718096; font-size: 14px; padding: 8px 0; border-top: 1px solid #e2e8f0;">
                                            <strong>Nuevo Estado:</strong>
                                        </td>
                                        <td style="text-align: right; padding: 8px 0; border-top: 1px solid #e2e8f0;">
                                            <span style="background: ${config.primary}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">
                                                ${newStatus}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            ${statusReason ? `
                            <!-- Nota/Razón del estado -->
                            <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                                    <strong style="color: #2d3748;">Nota del administrador:</strong><br>
                                    ${statusReason}
                                </p>
                            </div>
                            ` : ''}

                            ${newStatus === 'Aprobado' ? `
                            <!-- Mensaje especial para aprobados -->
                            <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #065f46; font-size: 15px; line-height: 1.6;">
                                    <strong>🎉 ¡Excelentes noticias!</strong><br>
                                    Tu crédito ha sido aprobado. En breve nos pondremos en contacto contigo para finalizar el proceso de desembolso.
                                </p>
                            </div>
                            ` : ''}

                            ${newStatus === 'Documentos requeridos' ? `
                            <!-- Mensaje para documentos requeridos -->
                            <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.6;">
                                    <strong>📄 Acción requerida:</strong><br>
                                    Para continuar con el proceso de evaluación, necesitamos que subas documentación adicional a través de tu panel de control.
                                </p>
                            </div>
                            ` : ''}

                            ${newStatus === 'Desembolsado' ? `
                            <!-- Mensaje para desembolsado -->
                            <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="margin: 0; color: #065f46; font-size: 15px; line-height: 1.6;">
                                    <strong>💰 ¡Fondos transferidos!</strong><br>
                                    El monto de ${formattedAmount} ha sido desembolsado exitosamente. Deberías verlo reflejado en tu cuenta bancaria en las próximas 24-48 horas hábiles.
                                </p>
                            </div>
                            ` : ''}

                            <p style="color: #718096; font-size: 14px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                                Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f7f9fc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                                Este es un correo automático, por favor no respondas a este mensaje.
                            </p>
                            <div style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                                © 2025 Pyme. Todos los derechos reservados.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};
