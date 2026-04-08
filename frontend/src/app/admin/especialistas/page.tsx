'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { apiUrl, authHeaders as _authHeaders } from '@/lib/api';
import type { ISpecialist, IWeeklySchedule } from '@/types';
import { DAYS_MAP } from '@/lib/constants';

function authHeaders() {
  return {
    ..._authHeaders(),
    'Content-Type': 'application/json',
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const DAYS: IWeeklySchedule['day'][] = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

const DEFAULT_SCHEDULE: IWeeklySchedule[] = DAYS.map((day) => ({
  day,
  startTime: '08:00',
  endTime: '17:00',
  blockDuration: 30,
}));

interface SpecialistForm {
  name: string;
  slug: string;
  photo: string;
  specialty: string;
  subspecialty: string;
  description: string;
  experience: number;
  isActive: boolean;
  weeklySchedule: IWeeklySchedule[];
}

const emptyForm: SpecialistForm = {
  name: '',
  slug: '',
  photo: '',
  specialty: '',
  subspecialty: '',
  description: '',
  experience: 0,
  isActive: true,
  weeklySchedule: DEFAULT_SCHEDULE,
};

export default function EspecialistasPage() {
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<ISpecialist | null>(null);
  const [form, setForm] = useState<SpecialistForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  async function fetchSpecialists() {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/specialists?active=all'), {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSpecialists(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Error al cargar especialistas');
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setSelectedSpecialist(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(specialist: ISpecialist) {
    setSelectedSpecialist(specialist);
    setForm({
      name: specialist.name,
      slug: specialist.slug,
      photo: specialist.photo,
      specialty: specialist.specialty,
      subspecialty: specialist.subspecialty ?? '',
      description: specialist.description,
      experience: specialist.experience,
      isActive: specialist.isActive,
      weeklySchedule:
        specialist.weeklySchedule.length > 0
          ? specialist.weeklySchedule
          : DEFAULT_SCHEDULE,
    });
    setDialogOpen(true);
  }

  function openDeleteDialog(specialist: ISpecialist) {
    setSelectedSpecialist(specialist);
    setDeleteDialogOpen(true);
  }

  function updateScheduleDay(
    dayIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) {
    const updated = [...form.weeklySchedule];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setForm({ ...form, weeklySchedule: updated });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
    };

    try {
      const url = selectedSpecialist
        ? apiUrl(`/api/specialists/${selectedSpecialist._id}`)
        : apiUrl('/api/specialists');
      const method = selectedSpecialist ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Error al guardar');
      }

      toast.success(
        selectedSpecialist
          ? 'Especialista actualizado correctamente'
          : 'Especialista creado correctamente'
      );
      setDialogOpen(false);
      fetchSpecialists();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar el especialista');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedSpecialist) return;
    setDeleting(true);

    try {
      const res = await fetch(apiUrl(`/api/specialists/${selectedSpecialist._id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      toast.success('Especialista eliminado correctamente');
      setDeleteDialogOpen(false);
      setSelectedSpecialist(null);
      fetchSpecialists();
    } catch {
      toast.error('Error al eliminar el especialista');
    } finally {
      setDeleting(false);
    }
  }

  const filtered = specialists.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Especialistas</h2>
          <p className="text-sm text-slate-500">
            Gestiona los especialistas de la clinica
          </p>
        </div>
        <Button onClick={openCreateDialog} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Especialista
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                Lista de Especialistas
              </CardTitle>
              <CardDescription>
                {filtered.length} especialista{filtered.length !== 1 ? 's' : ''}{' '}
                encontrado{filtered.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar especialista..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <Users className="mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm">No se encontraron especialistas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Experiencia</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((specialist) => (
                    <TableRow key={specialist._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                            {specialist.photo ? (
                              <Image
                                src={specialist.photo}
                                alt={specialist.name}
                                fill
                                sizes="36px"
                                unoptimized
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Users className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{specialist.name}</p>
                            <p className="text-xs text-slate-400">
                              {specialist.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{specialist.specialty}</p>
                          {specialist.subspecialty && (
                            <p className="text-xs text-slate-400">
                              {specialist.subspecialty}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {specialist.experience}{' '}
                        {specialist.experience === 1 ? 'ano' : 'anos'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            specialist.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {specialist.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(specialist)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => openDeleteDialog(specialist)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSpecialist
                ? 'Editar Especialista'
                : 'Nuevo Especialista'}
            </DialogTitle>
            <DialogDescription>
              {selectedSpecialist
                ? 'Modifica los datos del especialista'
                : 'Completa los datos para crear un nuevo especialista'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sp-name">Nombre</Label>
                <Input
                  id="sp-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-slug">Slug</Label>
                <Input
                  id="sp-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sp-photo">URL de Foto</Label>
              <Input
                id="sp-photo"
                type="url"
                placeholder="https://..."
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sp-specialty">Especialidad</Label>
                <Input
                  id="sp-specialty"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-subspecialty">Subespecialidad</Label>
                <Input
                  id="sp-subspecialty"
                  value={form.subspecialty}
                  onChange={(e) =>
                    setForm({ ...form, subspecialty: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sp-description">Descripción *</Label>
              <Textarea
                id="sp-description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                required
                minLength={10}
                placeholder="Describe al especialista (mínimo 10 caracteres)"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sp-experience">Anos de Experiencia</Label>
                <Input
                  id="sp-experience"
                  type="number"
                  min={0}
                  value={form.experience}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      experience: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex items-end gap-3 pb-1">
                <Switch
                  id="sp-isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isActive: checked })
                  }
                />
                <Label htmlFor="sp-isActive">Especialista activo</Label>
              </div>
            </div>

            <Separator />

            {/* Weekly Schedule */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Horario Semanal
              </Label>
              <div className="space-y-2">
                {form.weeklySchedule.map((sched, i) => (
                  <div
                    key={sched.day}
                    className="grid grid-cols-[120px_1fr_1fr] items-center gap-3 rounded-lg border border-slate-200 p-3"
                  >
                    <span className="text-sm font-medium text-slate-600">
                      {DAYS_MAP[sched.day] || sched.day}
                    </span>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Inicio</Label>
                      <Input
                        type="time"
                        value={sched.startTime}
                        onChange={(e) =>
                          updateScheduleDay(i, 'startTime', e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Fin</Label>
                      <Input
                        type="time"
                        value={sched.endTime}
                        onChange={(e) =>
                          updateScheduleDay(i, 'endTime', e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-700">
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {selectedSpecialist ? 'Guardar Cambios' : 'Crear Especialista'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Especialista</DialogTitle>
            <DialogDescription>
              ¿Estas seguro de que deseas eliminar al especialista{' '}
              <strong>{selectedSpecialist?.name}</strong>? Esta accion no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
