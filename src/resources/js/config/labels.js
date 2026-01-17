/**
 * Centralized Labels/Translations
 *
 * All UI text should be defined here for easy maintenance and future i18n support.
 * To change any text across the app, simply modify the value here.
 *
 * Usage:
 *   import { labels } from '@/config/labels';
 *   <span>{labels.auth.login}</span>
 *
 * Or import specific sections:
 *   import { auth, common } from '@/config/labels';
 *   <span>{auth.login}</span>
 */

// Common labels used across the application
export const common = {
    appName: 'Smart Admin+',
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    update: 'Actualizar',
    search: 'Buscar',
    filter: 'Filtrar',
    actions: 'Acciones',
    yes: 'Sí',
    no: 'No',
    confirm: 'Confirmar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    submit: 'Enviar',
    reset: 'Restablecer',
    close: 'Cerrar',
    open: 'Abrir',
    view: 'Ver',
    download: 'Descargar',
    upload: 'Subir',
    export: 'Exportar',
    import: 'Importar',
    print: 'Imprimir',
    refresh: 'Actualizar',
    noData: 'No hay datos disponibles',
    noResults: 'No se encontraron resultados',
    required: 'Requerido',
    optional: 'Opcional',
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información',
};

// Authentication related labels
export const auth = {
    // Login
    login: 'Iniciar Sesión',
    loginButton: 'INGRESAR',
    loggingIn: 'INGRESANDO...',
    logout: 'Cerrar Sesión',
    loggingOut: 'Cerrando sesión...',

    // Register
    register: 'Registrarse',
    registerButton: 'REGISTRARSE',
    registering: 'CREANDO CUENTA...',
    createAccount: 'Crear Cuenta',

    // Form fields
    email: 'Correo electrónico',
    emailPlaceholder: 'Usuario',
    password: 'Contraseña',
    passwordPlaceholder: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    confirmPasswordPlaceholder: 'Confirmar contraseña',
    name: 'Nombre',
    namePlaceholder: 'Nombre completo',
    rememberMe: 'Recordarme',

    // Password reset
    forgotPassword: '¿Olvidaste tu contraseña?',
    resetPassword: 'Restablecer Contraseña',
    resetPasswordButton: 'RESTABLECER CONTRASEÑA',
    resettingPassword: 'RESTABLECIENDO...',
    sendResetLink: 'ENVIAR ENLACE',
    sendingResetLink: 'ENVIANDO...',
    newPassword: 'Nueva contraseña',
    newPasswordPlaceholder: 'Nueva contraseña',

    // Email verification
    verifyEmail: 'Verificar Email',
    resendVerification: 'REENVIAR VERIFICACIÓN',
    sendingVerification: 'ENVIANDO...',
    verificationSent: 'Se ha enviado un nuevo enlace de verificación a tu correo.',

    // Messages
    welcomeBack: '¡Bienvenido de nuevo!',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    forgotPasswordDesc: 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.',
    verifyEmailDesc: '¡Gracias por registrarte! Antes de comenzar, verifica tu correo electrónico haciendo clic en el enlace que te enviamos.',

    // Confirm password
    confirmPasswordTitle: 'Confirmar Contraseña',
    confirmPasswordDesc: 'Esta es un área segura. Por favor confirma tu contraseña antes de continuar.',
    confirmButton: 'CONFIRMAR',
    confirming: 'CONFIRMANDO...',
};

// Navigation/Menu labels
export const navigation = {
    menu: 'Menú',
    dashboard: 'Dashboard',
    profile: 'Perfil',
    settings: 'Configuración',
    notifications: 'Notificaciones',
    accountSettings: 'Configuración de Cuenta',
    supportCenter: 'Centro de Soporte',
};

// Profile related labels
export const profile = {
    title: 'Perfil',
    editProfile: 'Editar Perfil',
    profileInformation: 'Información del Perfil',
    profileInformationDesc: 'Actualiza la información de tu perfil y dirección de correo electrónico.',
    updatePassword: 'Actualizar Contraseña',
    updatePasswordDesc: 'Asegúrate de usar una contraseña larga y aleatoria para mantener tu cuenta segura.',
    currentPassword: 'Contraseña actual',
    deleteAccount: 'Eliminar Cuenta',
    deleteAccountDesc: 'Una vez que tu cuenta sea eliminada, todos sus recursos y datos serán eliminados permanentemente.',
    deleteAccountWarning: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
    saved: 'Guardado.',
};

// Dashboard labels
export const dashboard = {
    title: 'Dashboard',
    welcome: 'Bienvenido',
    overview: 'Resumen',
    statistics: 'Estadísticas',
    recentActivity: 'Actividad Reciente',
    totalUsers: 'Total Usuarios',
    totalOrders: 'Total Pedidos',
    totalRevenue: 'Ingresos Totales',
    analytics: 'Analíticas',
};

// Form validation messages
export const validation = {
    required: 'Este campo es requerido',
    email: 'Ingresa un correo electrónico válido',
    minLength: (min) => `Debe tener al menos ${min} caracteres`,
    maxLength: (max) => `Debe tener máximo ${max} caracteres`,
    passwordMatch: 'Las contraseñas no coinciden',
    invalidCredentials: 'Credenciales inválidas',
};

// Company/Branding (can be overridden by app.js config)
export const company = {
    name: 'SMART IDEAS',
    fullName: 'Smart Admin+',
    tagline: 'La herramienta que facilita la administración de su empresa o negocio, de manera segura rápida y eficiente.',
    description: 'Solo necesita estar conectado a internet para poder acceder a su información, desde cualquier parte del mundo y sin complicaciones.',
    welcomeTitle: 'Bienvenido a Smart Admin+',
    copyright: 'Derechos Reservados',
};

// Export all labels as a single object for convenience
export const labels = {
    common,
    auth,
    navigation,
    profile,
    dashboard,
    validation,
    company,
};

export default labels;
