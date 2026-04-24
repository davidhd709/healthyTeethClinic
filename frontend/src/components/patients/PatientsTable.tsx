'use client';

import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
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
import type { IPatient } from '@/types';
import { calculateAge, fullName, initials } from '@/lib/patient-utils';

interface PatientsTableProps {
  patients: IPatient[];
  canManage: boolean;
  onDeactivate: (patient: IPatient) => void;
}

export default function PatientsTable({
  patients,
  canManage,
  onDeactivate,
}: PatientsTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                No hay pacientes para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => {
              const age = calculateAge(patient.birthDate);
              return (
                <TableRow key={patient._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-sm font-semibold text-cyan-700">
                        {initials(patient)}
                      </div>
                      <div className="flex flex-col">
                        <Link
                          href={`/admin/pacientes/${patient._id}`}
                          className="font-medium text-slate-900 hover:text-cyan-700"
                        >
                          {fullName(patient)}
                        </Link>
                        {patient.insuranceProvider && (
                          <span className="text-xs text-slate-500">
                            {patient.insuranceProvider}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <span className="font-mono">{patient.documentNumber}</span>
                      <span className="text-xs text-slate-500">{patient.documentType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {age !== null ? `${age} años` : '—'}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <span>{patient.phone}</span>
                      {patient.email && (
                        <span className="text-xs text-slate-500">{patient.email}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.isActive ? (
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
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        title="Ver perfil"
                      >
                        <Link href={`/admin/pacientes/${patient._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {canManage && (
                        <>
                          <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            title="Editar"
                          >
                            <Link href={`/admin/pacientes/${patient._id}/editar`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          {patient.isActive && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onDeactivate(patient)}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              title="Desactivar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
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
