'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Loader2, Users } from 'lucide-react';
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
import { apiUrl, authHeaders as baseAuthHeaders } from '@/lib/api';
import type { IUser, ISpecialist, UserRole } from '@/types';
import UserForm, { type UserFormValues } from '@/components/admin/UserForm';
import UserTable from '@/components/admin/UserTable';

function jsonHeaders() {
  return {
    ...baseAuthHeaders(),
    'Content-Type': 'application/json',
  };
}

type RoleFilter = 'all' | UserRole;

export default function UsuariosPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<IUser | null>(null);
  const [saving, setSaving] = useState(false);

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<IUser | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ active: 'all' });
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(apiUrl(`/api/users?${params.toString()}`), {
        headers: baseAuthHeaders(),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as IUser[];
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('No se pudo cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    async function loadSpecialists() {
      try {
        const res = await fetch(apiUrl('/api/specialists?active=all'), {
          headers: baseAuthHeaders(),
        });
        if (!res.ok) return;
        const data = (await res.json()) as ISpecialist[];
        setSpecialists(Array.isArray(data) ? data : []);
      } catch {
        /* silent */
      }
    }
    loadSpecialists();
  }, []);

  function openCreate() {
    setSelected(null);
    setDialogOpen(true);
  }

  function openEdit(user: IUser) {
    setSelected(user);
    setDialogOpen(true);
  }

  function openDeactivate(user: IUser) {
    setTargetUser(user);
    setDeactivateOpen(true);
  }

  async function handleSubmit(values: UserFormValues) {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        email: values.email,
        name: values.name,
        role: values.role,
        isActive: values.isActive,
      };
      if (values.role === 'specialist' && values.specialistId) {
        payload.specialistId = values.specialistId;
      }
      if (values.password) {
        payload.password = values.password;
      }

      const url = selected ? apiUrl(`/api/users/${selected._id}`) : apiUrl('/api/users');
      const method = selected ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const message =
          err?.message || err?.error || (selected ? 'Error al actualizar usuario' : 'Error al crear usuario');
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }

      toast.success(selected ? 'Usuario actualizado' : 'Usuario creado');
      setDialogOpen(false);
      setSelected(null);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!targetUser) return;
    setDeactivating(true);
    try {
      const res = await fetch(apiUrl(`/api/users/${targetUser._id}`), {
        method: 'DELETE',
        headers: baseAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'No se pudo desactivar');
      }
      toast.success('Usuario desactivado');
      setDeactivateOpen(false);
      setTargetUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al desactivar');
    } finally {
      setDeactivating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <Users className="h-6 w-6 text-cyan-600" />
            Usuarios
          </h1>
          <p className="text-sm text-slate-600">
            Gestiona las cuentas de administradores, especialistas y recepcionistas.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo usuario
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Listado</CardTitle>
              <CardDescription>
                Mostrando {users.length} usuario{users.length === 1 ? '' : 's'}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o correo"
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v: RoleFilter) => setRoleFilter(v)}>
                <SelectTrigger className="md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="specialist">Especialista</SelectItem>
                  <SelectItem value="receptionist">Recepcionista</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <UserTable users={users} onEdit={openEdit} onDeactivate={openDeactivate} />
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
            <DialogDescription>
              {selected
                ? 'Actualiza los datos de esta cuenta. Deja la contraseña vacía para no cambiarla.'
                : 'Crea una cuenta de acceso al panel con su rol correspondiente.'}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            key={selected?._id ?? 'new'}
            initialUser={selected}
            specialists={specialists}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Desactivar usuario</DialogTitle>
            <DialogDescription>
              {targetUser
                ? `¿Confirmas desactivar a ${targetUser.name}? No podrá iniciar sesión hasta que lo reactives.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivateOpen(false)}
              disabled={deactivating}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              disabled={deactivating}
            >
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
