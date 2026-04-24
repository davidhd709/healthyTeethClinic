'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiUrl, authHeaders } from '@/lib/api';
import PatientForm from '@/components/patients/PatientForm';
import type { PatientFormValues } from '@/lib/validations/patient.schema';
import type { IPatient } from '@/types';

export default function NuevoPacientePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(values: PatientFormValues) {
    setSaving(true);
    try {
      const payload = normalizeValues(values);
      const res = await fetch(apiUrl('/api/patients'), {
        method: 'POST',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const message =
          err?.message ?? err?.error ?? 'Error al crear paciente';
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }
      const created = (await res.json()) as IPatient;
      toast.success('Paciente creado');
      router.push(`/admin/pacientes/${created._id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/pacientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Nuevo paciente</h1>
          <p className="text-sm text-slate-600">
            Completa los datos personales, clínicos y de contacto.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm
            submitting={saving}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin/pacientes')}
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
