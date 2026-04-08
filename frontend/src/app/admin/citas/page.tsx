'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  CalendarCheck,
  Loader2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import { apiUrl, authHeaders as _authHeaders } from '@/lib/api';
import type {
  IAppointment,
  IService,
  ISpecialist,
  AppointmentStatus,
} from '@/types';

function authHeaders() {
  return {
    ..._authHeaders(),
    'Content-Type': 'application/json',
  };
}

const ALL_STATUSES: AppointmentStatus[] = [
  'pendiente',
  'confirmada',
  'cancelada',
  'completada',
];

const PAGE_SIZE = 15;

export default function CitasPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [specialistFilter, setSpecialistFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [page, setPage] = useState(1);

  // Detail dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);

  // Status change loading
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [aptsRes, svcRes, spRes] = await Promise.all([
        fetch(apiUrl('/api/appointments'), { headers: authHeaders() }),
        fetch(apiUrl('/api/services'), { headers: authHeaders() }),
        fetch(apiUrl('/api/specialists'), { headers: authHeaders() }),
      ]);

      const apts = aptsRes.ok ? await aptsRes.json() : [];
      const svcs = svcRes.ok ? await svcRes.json() : [];
      const sps = spRes.ok ? await spRes.json() : [];

      setAppointments(Array.isArray(apts) ? apts : []);
      setServices(Array.isArray(svcs) ? svcs : []);
      setSpecialists(Array.isArray(sps) ? sps : []);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }

  async function fetchAppointments() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      if (specialistFilter !== 'all')
        params.set('specialistId', specialistFilter);
      if (serviceFilter !== 'all') params.set('serviceId', serviceFilter);

      const res = await fetch(apiUrl(`/api/appointments?${params.toString()}`), {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
      setPage(1);
    } catch {
      toast.error('Error al cargar citas');
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFrom, dateTo, specialistFilter, serviceFilter]);

  async function handleStatusChange(
    appointmentId: string,
    newStatus: AppointmentStatus
  ) {
    setChangingStatus(appointmentId);
    try {
      const res = await fetch(apiUrl(`/api/appointments/${appointmentId}/status`), {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Estado actualizado a ${STATUS_LABELS[newStatus]}`);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, status: newStatus } : a
        )
      );
    } catch {
      toast.error('Error al cambiar el estado');
    } finally {
      setChangingStatus(null);
    }
  }

  function getServiceName(serviceId: string | IService): string {
    if (typeof serviceId === 'object') return serviceId.name;
    const svc = services.find((s) => s._id === serviceId);
    return svc?.name ?? serviceId;
  }

  function getSpecialistName(specialistId: string | ISpecialist): string {
    if (typeof specialistId === 'object') return specialistId.name;
    const sp = specialists.find((s) => s._id === specialistId);
    return sp?.name ?? specialistId;
  }

  // Client-side search filter
  const filtered = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      apt.patientName.toLowerCase().includes(term) ||
      apt.patientEmail.toLowerCase().includes(term) ||
      apt.patientPhone.toLowerCase().includes(term)
    );
  });

  // Sort by date desc then time desc
  const sorted = [...filtered].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.time.localeCompare(a.time);
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openDetail(apt: IAppointment) {
    setSelectedAppointment(apt);
    setDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Citas</h2>
        <p className="text-sm text-slate-500">
          Gestiona las citas de la clinica
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <CardTitle className="text-sm font-medium">Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Desde</Label>
              <Input
                type="date"
                className="h-9"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Hasta</Label>
              <Input
                type="date"
                className="h-9"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Especialista</Label>
              <Select
                value={specialistFilter}
                onValueChange={setSpecialistFilter}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {specialists.map((sp) => (
                    <SelectItem key={sp._id} value={sp._id}>
                      {sp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Servicio</Label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {services.map((svc) => (
                    <SelectItem key={svc._id} value={svc._id}>
                      {svc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Lista de Citas</CardTitle>
              <CardDescription>
                {sorted.length} cita{sorted.length !== 1 ? 's' : ''}{' '}
                encontrada{sorted.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <CalendarCheck className="mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm">No se encontraron citas</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Especialista</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((apt) => (
                      <TableRow key={apt._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{apt.patientName}</p>
                            <p className="text-xs text-slate-400">
                              {apt.patientEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getServiceName(apt.serviceId)}
                        </TableCell>
                        <TableCell>
                          {getSpecialistName(apt.specialistId)}
                        </TableCell>
                        <TableCell>{apt.date}</TableCell>
                        <TableCell>{apt.time}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              STATUS_COLORS[apt.status] ||
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {STATUS_LABELS[apt.status] || apt.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={changingStatus === apt._id}
                                  className="h-8 text-xs"
                                >
                                  {changingStatus === apt._id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    'Cambiar Estado'
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {ALL_STATUSES.map((s) => (
                                  <DropdownMenuItem
                                    key={s}
                                    disabled={apt.status === s}
                                    onClick={() =>
                                      handleStatusChange(apt._id, s)
                                    }
                                  >
                                    <span
                                      className={`mr-2 inline-block h-2 w-2 rounded-full ${
                                        STATUS_COLORS[s]
                                          ?.split(' ')[0] || 'bg-gray-300'
                                      }`}
                                    />
                                    {STATUS_LABELS[s]}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openDetail(apt)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">
                    Pagina {page} de {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de Cita</DialogTitle>
            <DialogDescription>
              Informacion completa de la cita
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Paciente
                  </p>
                  <p className="font-medium">
                    {selectedAppointment.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Email</p>
                  <p className="text-sm">
                    {selectedAppointment.patientEmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Telefono
                  </p>
                  <p className="text-sm">
                    {selectedAppointment.patientPhone}
                  </p>
                </div>
                {selectedAppointment.patientDocument && (
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Documento
                    </p>
                    <p className="text-sm">
                      {selectedAppointment.patientDocument}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Servicio
                  </p>
                  <p className="text-sm">
                    {getServiceName(selectedAppointment.serviceId)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Especialista
                  </p>
                  <p className="text-sm">
                    {getSpecialistName(selectedAppointment.specialistId)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Fecha</p>
                  <p className="text-sm">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Hora</p>
                  <p className="text-sm">{selectedAppointment.time}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-medium text-slate-400">Estado</p>
                <Badge
                  className={`mt-1 ${
                    STATUS_COLORS[selectedAppointment.status] ||
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {STATUS_LABELS[selectedAppointment.status] ||
                    selectedAppointment.status}
                </Badge>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Motivo de visita
                </p>
                <p className="mt-1 text-sm">
                  {selectedAppointment.reasonForVisit || 'No especificado'}
                </p>
              </div>

              {selectedAppointment.internalNotes && (
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Notas internas
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedAppointment.internalNotes}
                  </p>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Creada
                  </p>
                  <p className="text-sm">
                    {new Date(
                      selectedAppointment.createdAt
                    ).toLocaleString('es-CO')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Actualizada
                  </p>
                  <p className="text-sm">
                    {new Date(
                      selectedAppointment.updatedAt
                    ).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
