'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Stethoscope,
  Users,
  Database,
  Loader2,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import { apiUrl, authHeaders } from '@/lib/api';
import type { IAppointment, IService, ISpecialist } from '@/types';

interface Stats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalServices: number;
  totalSpecialists: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [appointmentsRes, servicesRes, specialistsRes] = await Promise.all([
        fetch(apiUrl('/api/appointments'), { headers: authHeaders() }),
        fetch(apiUrl('/api/services'), { headers: authHeaders() }),
        fetch(apiUrl('/api/specialists'), { headers: authHeaders() }),
      ]);

      const appointments: IAppointment[] = appointmentsRes.ok
        ? await appointmentsRes.json()
        : [];
      const services: IService[] = servicesRes.ok
        ? await servicesRes.json()
        : [];
      const specialists: ISpecialist[] = specialistsRes.ok
        ? await specialistsRes.json()
        : [];

      const appointmentsList = Array.isArray(appointments) ? appointments : [];

      setStats({
        totalAppointments: appointmentsList.length,
        pendingAppointments: appointmentsList.filter(
          (a) => a.status === 'pendiente'
        ).length,
        confirmedAppointments: appointmentsList.filter(
          (a) => a.status === 'confirmada'
        ).length,
        totalServices: Array.isArray(services) ? services.length : 0,
        totalSpecialists: Array.isArray(specialists) ? specialists.length : 0,
      });

      // Get last 10 appointments sorted by createdAt desc
      const sorted = [...appointmentsList].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentAppointments(sorted.slice(0, 10));
    } catch {
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch(apiUrl('/api/seed'), {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Error al sembrar datos');
      toast.success('Base de datos sembrada correctamente');
      fetchDashboardData();
    } catch {
      toast.error('Error al sembrar la base de datos');
    } finally {
      setSeeding(false);
    }
  }

  const statCards = [
    {
      label: 'Total Citas',
      value: stats?.totalAppointments ?? 0,
      icon: CalendarCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Pendientes',
      value: stats?.pendingAppointments ?? 0,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Confirmadas',
      value: stats?.confirmedAppointments ?? 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Servicios',
      value: stats?.totalServices ?? 0,
      icon: Stethoscope,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Especialistas',
      value: stats?.totalSpecialists ?? 0,
      icon: Users,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Resumen general de la clinica
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) =>
          loading ? (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ) : (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Quick Actions & Analytics Placeholder */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acciones Rapidas</CardTitle>
            <CardDescription>
              Accesos directos a funciones comunes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSeed}
              disabled={seeding}
            >
              {seeding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Sembrar Base de Datos
            </Button>
            <Link href="/admin/servicios" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Stethoscope className="mr-2 h-4 w-4" />
                Gestionar Servicios
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/especialistas" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Gestionar Especialistas
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/citas" className="block">
              <Button variant="outline" className="w-full justify-start">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Gestionar Citas
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Analytics Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Analiticas</CardTitle>
            <CardDescription>
              Visualizacion de datos de la clinica
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-[200px] items-center justify-center">
            <div className="text-center text-slate-400">
              <BarChart3 className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-sm font-medium">Analytics coming soon</p>
              <p className="mt-1 text-xs text-slate-400">
                Graficas de citas, ingresos y tendencias
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Citas Recientes</CardTitle>
          <CardDescription>Ultimas 10 citas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No hay citas registradas. Usa &quot;Sembrar Base de Datos&quot; para
              generar datos de ejemplo.
            </div>
          ) : (
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAppointments.map((apt) => (
                    <TableRow key={apt._id}>
                      <TableCell className="font-medium">
                        {apt.patientName}
                      </TableCell>
                      <TableCell>
                        {typeof apt.serviceId === 'object'
                          ? apt.serviceId.name
                          : apt.serviceId}
                      </TableCell>
                      <TableCell>
                        {typeof apt.specialistId === 'object'
                          ? apt.specialistId.name
                          : apt.specialistId}
                      </TableCell>
                      <TableCell>{apt.date}</TableCell>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            STATUS_COLORS[apt.status] || 'bg-gray-100 text-gray-800'
                          }
                        >
                          {STATUS_LABELS[apt.status] || apt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
