'use client';

import { Pencil, Trash2, ShieldCheck, UserCog, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { IUser, UserRole } from '@/types';

const ROLE_META: Record<
  UserRole,
  { label: string; className: string; icon: typeof ShieldCheck }
> = {
  admin: {
    label: 'Administrador',
    className: 'bg-rose-100 text-rose-700 hover:bg-rose-100',
    icon: ShieldCheck,
  },
  specialist: {
    label: 'Especialista',
    className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100',
    icon: UserCog,
  },
  receptionist: {
    label: 'Recepcionista',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    icon: Headset,
  },
};

interface UserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDeactivate: (user: IUser) => void;
}

function formatDate(value?: string) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return value;
  }
}

export default function UserTable({ users, onEdit, onDeactivate }: UserTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Último acceso</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
                No hay usuarios para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const meta = ROLE_META[user.role];
              const Icon = meta.icon;
              return (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={meta.className} variant="secondary">
                      <Icon className="mr-1 h-3 w-3" />
                      {meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100"
                      >
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-200 text-slate-600">
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDate(user.lastLoginAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(user)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {user.isActive && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeactivate(user)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Desactivar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
