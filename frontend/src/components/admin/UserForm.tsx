'use client';

import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IUser, UserRole, ISpecialist } from '@/types';

export interface UserFormValues {
  email: string;
  name: string;
  role: UserRole;
  password: string;
  specialistId: string;
  isActive: boolean;
}

function deriveInitial(user?: IUser | null): UserFormValues {
  if (!user) {
    return {
      email: '',
      name: '',
      role: 'receptionist',
      password: '',
      specialistId: '',
      isActive: true,
    };
  }
  const rawSpecialistId =
    typeof user.specialistId === 'string'
      ? user.specialistId
      : user.specialistId?._id ?? '';
  return {
    email: user.email,
    name: user.name,
    role: user.role,
    password: '',
    specialistId: rawSpecialistId,
    isActive: user.isActive,
  };
}

interface UserFormProps {
  initialUser?: IUser | null;
  specialists: ISpecialist[];
  saving: boolean;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export default function UserForm({
  initialUser,
  specialists,
  saving,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [form, setForm] = useState<UserFormValues>(() => deriveInitial(initialUser));
  const isEdit = !!initialUser;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="user-name">Nombre completo</Label>
          <Input
            id="user-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            minLength={3}
            placeholder="Dra. María Rodríguez"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="user-email">Correo</Label>
          <Input
            id="user-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="usuario@healthyteeth.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="user-role">Rol</Label>
          <Select
            value={form.role}
            onValueChange={(value: UserRole) =>
              setForm({
                ...form,
                role: value,
                specialistId: value === 'specialist' ? form.specialistId : '',
              })
            }
          >
            <SelectTrigger id="user-role">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="specialist">Especialista</SelectItem>
              <SelectItem value="receptionist">Recepcionista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="user-password">
            {isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          </Label>
          <Input
            id="user-password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!isEdit}
            minLength={isEdit && form.password.length === 0 ? undefined : 8}
            placeholder={isEdit ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
            autoComplete="new-password"
          />
        </div>

        {form.role === 'specialist' && (
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="user-specialist">Especialista vinculado</Label>
            <Select
              value={form.specialistId}
              onValueChange={(value) => setForm({ ...form, specialistId: value })}
            >
              <SelectTrigger id="user-specialist">
                <SelectValue placeholder="Selecciona un especialista" />
              </SelectTrigger>
              <SelectContent>
                {specialists.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name} — {s.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Necesario si este usuario debe ver sus pacientes y citas asignadas.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 md:col-span-2">
          <Switch
            id="user-active"
            checked={form.isActive}
            onCheckedChange={(value) => setForm({ ...form, isActive: value })}
          />
          <Label htmlFor="user-active" className="cursor-pointer">
            Usuario activo
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando…
            </>
          ) : isEdit ? (
            'Guardar cambios'
          ) : (
            'Crear usuario'
          )}
        </Button>
      </div>
    </form>
  );
}
