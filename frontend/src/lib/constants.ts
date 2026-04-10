export const CLINIC_NAME = 'Healthy Teeth Clinic';
export const CLINIC_PHONE = '+57 601 555 0123';
export const CLINIC_WHATSAPP = '+57 300 555 0123';
export const CLINIC_EMAIL = 'contacto@healthyteethclinic.com';
export const CLINIC_ADDRESS = 'Calle 93 #12-45, Consultorio 301, Bogotá, Colombia';
export const CLINIC_HOURS = 'Lunes a Viernes: 7:00 AM - 7:00 PM | Sábado: 8:00 AM - 2:00 PM';

export const DAYS_MAP: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
};

export const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  completada: 'Completada',
};

export const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
  completada: 'bg-blue-100 text-blue-800',
};

export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/especialistas', label: 'Especialistas' },
  { href: '/contacto', label: 'Contacto' },
];
