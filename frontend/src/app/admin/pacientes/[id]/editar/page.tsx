'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { apiUrl, authHeaders } from '@/lib/api';
import PatientForm from '@/components/patients/PatientForm';
import type { PatientFormValues } from '@/lib/validations/patient.schema';
import type { IPatient } from '@/types';
import { fullName } from '@/lib/patient-utils';

interface EditarPacientePageProps {
  params: Promise<{ id: string }>;
}

export default function EditarPacientePage({ params }: EditarPacientePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  async function handleSubmit(values: PatientFormValues) {
    setSaving(true);
    try {
      const payload = normalizeValues(values);
      const res = await fetch(apiUrl(`/api/patients/${id}`), {
        method: 'PATCH',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const message = err?.message ?? err?.error ?? 'Error al actualizar';
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }
      toast.success('Paciente actualizado');
      router.push(`/admin/pacientes/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/admin/pacientes/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Editar: {fullName(patient)}
          </h1>
          <p className="text-sm text-slate-600">
            Actualiza los datos del paciente. Los cambios se guardan con auditoría.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm
            initialPatient={patient}
            submitting={saving}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/admin/pacientes/${id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function normalizeValues(values: PatientFormValues) {
  const emergency = values.emergencyContact;
  const normalizedEmergency =
    emergency && emergency.name && emergency.phone
      ? {
          name: emergency.name,
          phone: emergency.phone,
          relationship: emergency.relationship || undefined,
        }
      : undefined;

  return {
    ...values,
    email: values.email || undefined,
    address: values.address || undefined,
    city: values.city || undefined,
    insuranceProvider: values.insuranceProvider || undefined,
    observations: values.observations || undefined,
    emergencyContact: normalizedEmergency,
    medicalInfo: {
      ...values.medicalInfo,
      medicalHistory: values.medicalInfo.medicalHistory || undefined,
      dentalHistory: values.medicalInfo.dentalHistory || undefined,
    },
  };
}
