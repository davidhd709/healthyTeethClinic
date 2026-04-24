'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { apiUrl, authHeaders } from '@/lib/api';
import type { IPatient } from '@/types';
import PatientProfileTabs from '@/components/patients/PatientProfileTabs';
import { usePermissions } from '@/hooks/usePermissions';
import { calculateAge, fullName, initials } from '@/lib/patient-utils';

interface PacienteDetallePageProps {
  params: Promise<{ id: string }>;
}

export default function PacienteDetallePage({ params }: PacienteDetallePageProps) {
  const { id } = use(params);
  const { can } = usePermissions();
  const canManage = can('patients.manage');
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPatient = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/patients/${id}`), {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setPatient(await res.json());
    } catch {
      toast.error('No se pudo cargar el paciente');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!patient) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-slate-500">
          Paciente no encontrado.
          <div className="pt-3">
            <Button asChild variant="outline">
              <Link href="/admin/pacientes">Volver al listado</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const age = calculateAge(patient.birthDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/pacientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-1 items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-lg font-semibold text-cyan-700">
            {initials(patient)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900">{fullName(patient)}</h1>
              {patient.isActive ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 hover:bg-green-100"
                >
                  Activo
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                  Inactivo
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600">
              {patient.documentType} {patient.documentNumber}
              {age !== null && <> · {age} años</>}
              {patient.phone && <> · {patient.phone}</>}
            </p>
          </div>
          {canManage && (
            <Button asChild>
              <Link href={`/admin/pacientes/${patient._id}/editar`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}
        </div>
      </div>

      <PatientProfileTabs patient={patient} />
    </div>
  );
}
