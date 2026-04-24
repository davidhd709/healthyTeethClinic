'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Loader2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiUrl, authHeaders } from '@/lib/api';
import type { IPatient, IPaginatedPatients } from '@/types';
import PatientsTable from '@/components/patients/PatientsTable';
import { usePermissions } from '@/hooks/usePermissions';
import { fullName } from '@/lib/patient-utils';

type ActiveFilter = 'active' | 'inactive' | 'all';

export default function PacientesPage() {
  const { can } = usePermissions();
  const canManage = can('patients.manage');

  const [data, setData] = useState<IPaginatedPatients | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('active');
  const [page, setPage] = useState(1);

  const [target, setTarget] = useState<IPatient | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search.trim()) params.set('search', search.trim());
      if (activeFilter === 'all') params.set('active', 'all');
      else if (activeFilter === 'inactive') params.set('active', 'inactive');

      const res = await fetch(apiUrl(`/api/patients?${params.toString()}`), {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      const body = (await res.json()) as IPaginatedPatients;
      setData(body);
    } catch {
      toast.error('No se pudo cargar la lista de pacientes');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, page, search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchInput]);

  async function handleDeactivate() {
    if (!target) return;
    setDeactivating(true);
    try {
      const res = await fetch(apiUrl(`/api/patients/${target._id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message ?? 'No se pudo desactivar');
      }
      toast.success('Paciente desactivado');
      setTarget(null);
      fetchPatients();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setDeactivating(false);
    }
  }

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <Users className="h-6 w-6 text-cyan-600" />
            Pacientes
          </h1>
          <p className="text-sm text-slate-600">
            Gestiona la información clínica y administrativa de tus pacientes.
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link href="/admin/pacientes/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo paciente
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Listado</CardTitle>
              <CardDescription>
                {data ? `${data.total} paciente${data.total === 1 ? '' : 's'}` : '—'}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por nombre, documento, teléfono o correo"
                  className="pl-9 md:w-80"
                />
              </div>
              <Select
                value={activeFilter}
                onValueChange={(v: ActiveFilter) => {
                  setActiveFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="md:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <PatientsTable
              patients={items}
              canManage={canManage}
              onDeactivate={setTarget}
            />
          )}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>
                Página {data.page} de {data.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={data.page <= 1 || loading}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={data.page >= data.totalPages || loading}
                >
                  Siguiente
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Desactivar paciente</DialogTitle>
            <DialogDescription>
              {target
                ? `¿Confirmas desactivar a ${fullName(target)}? La información clínica se conserva; solo no aparecerá en búsquedas activas.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)} disabled={deactivating}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeactivate} disabled={deactivating}>
              {deactivating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desactivando…
                </>
              ) : (
                'Desactivar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
