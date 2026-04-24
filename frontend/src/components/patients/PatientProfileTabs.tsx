'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CalendarClock,
  ClipboardList,
  FileText,
  FolderOpen,
  NotebookText,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiUrl, authHeaders } from '@/lib/api';
import type { IAppointment, IPatient, IService, ISpecialist } from '@/types';
import { calculateAge, DOCUMENT_TYPE_LABELS, SEX_LABELS } from '@/lib/patient-utils';
import MedicalHistoryTabs from '@/components/medical-history/MedicalHistoryTabs';

interface PatientProfileTabsProps {
  patient: IPatient;
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  confirmada: 'bg-green-100 text-green-700 hover:bg-green-100',
  cancelada: 'bg-rose-100 text-rose-700 hover:bg-rose-100',
  completada: 'bg-slate-200 text-slate-700 hover:bg-slate-200',
};

function formatDate(value?: string) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('es-CO', {
      dateStyle: 'medium',
    });
  } catch {
    return value;
  }
}

export default function PatientProfileTabs({ patient }: PatientProfileTabsProps) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-slate-100 p-1">
        <TabsTrigger value="summary" className="gap-2">
          <UserRound className="h-4 w-4" />
          Resumen
        </TabsTrigger>
        <TabsTrigger value="appointments" className="gap-2">
          <CalendarClock className="h-4 w-4" />
          Citas
        </TabsTrigger>
        <TabsTrigger value="medical" className="gap-2">
          <ClipboardList className="h-4 w-4" />
          Historia clínica
        </TabsTrigger>
        <TabsTrigger value="odontogram" className="gap-2">
          <Stethoscope className="h-4 w-4" />
          Odontograma
        </TabsTrigger>
        <TabsTrigger value="procedures" className="gap-2">
          <FileText className="h-4 w-4" />
          Procedimientos
        </TabsTrigger>
        <TabsTrigger value="files" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          Archivos
        </TabsTrigger>
        <TabsTrigger value="notes" className="gap-2">
          <NotebookText className="h-4 w-4" />
          Observaciones
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-6">
        <SummaryTab patient={patient} />
      </TabsContent>

      <TabsContent value="appointments" className="mt-6">
        <AppointmentsTab patientId={patient._id} />
      </TabsContent>

      <TabsContent value="medical" className="mt-6">
        <MedicalHistoryTabs patientId={patient._id} />
      </TabsContent>

      <TabsContent value="odontogram" className="mt-6">
        <ComingSoon
          title="Odontograma clínico interactivo"
          description="Se activa en la Fase 4. Aquí podrás marcar tratamientos por diente y superficie (oclusal, mesial, distal, vestibular, lingual/palatina)."
        />
      </TabsContent>

      <TabsContent value="procedures" className="mt-6">
        <ComingSoon
          title="Procedimientos"
          description="Se activa en la Fase 5. Aquí se registran los procedimientos realizados o planificados con su estado, especialista y costo."
        />
      </TabsContent>

      <TabsContent value="files" className="mt-6">
        <ComingSoon
          title="Archivos adjuntos"
          description="Se activa en la Fase 9. Aquí podrás subir radiografías, fotografías y documentos vinculados al paciente."
        />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observaciones generales</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.observations ? (
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {patient.observations}
              </p>
            ) : (
              <p className="text-sm text-slate-500">Sin observaciones registradas.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function SummaryTab({ patient }: { patient: IPatient }) {
  const age = calculateAge(patient.birthDate);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <InfoRow label="Documento">
            {DOCUMENT_TYPE_LABELS[patient.documentType]} · {patient.documentNumber}
          </InfoRow>
          <InfoRow label="Fecha de nacimiento">
            {formatDate(patient.birthDate)}
            {age !== null && <span className="ml-2 text-slate-500">({age} años)</span>}
          </InfoRow>
          <InfoRow label="Sexo">{SEX_LABELS[patient.sex]}</InfoRow>
          <InfoRow label="Teléfono">{patient.phone}</InfoRow>
          <InfoRow label="Correo">{patient.email ?? '—'}</InfoRow>
          <InfoRow label="Dirección">{patient.address ?? '—'}</InfoRow>
          <InfoRow label="Ciudad">{patient.city ?? '—'}</InfoRow>
          <InfoRow label="EPS / Aseguradora">{patient.insuranceProvider ?? '—'}</InfoRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contacto de emergencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {patient.emergencyContact ? (
            <>
              <InfoRow label="Nombre">{patient.emergencyContact.name}</InfoRow>
              <InfoRow label="Teléfono">{patient.emergencyContact.phone}</InfoRow>
              <InfoRow label="Parentesco">
                {patient.emergencyContact.relationship ?? '—'}
              </InfoRow>
            </>
          ) : (
            <p className="text-sm text-slate-500">No registrado.</p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Antecedentes clínicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <TagList label="Alergias" items={patient.medicalInfo?.allergies ?? []} />
          <TagList label="Enfermedades relevantes" items={patient.medicalInfo?.diseases ?? []} />
          <TagList label="Medicamentos actuales" items={patient.medicalInfo?.medications ?? []} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Antecedentes médicos
            </p>
            <p className="whitespace-pre-wrap">
              {patient.medicalInfo?.medicalHistory ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Antecedentes odontológicos
            </p>
            <p className="whitespace-pre-wrap">
              {patient.medicalInfo?.dentalHistory ?? '—'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AppointmentsTab({ patientId }: { patientId: string }) {
  const [items, setItems] = useState<IAppointment[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(apiUrl(`/api/patients/${patientId}/appointments`), {
          headers: authHeaders(),
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as IAppointment[];
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) {
          setItems([]);
          toast.error('No se pudieron cargar las citas');
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  if (items === null) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-slate-500">
          Este paciente aún no tiene citas registradas.
          <div className="pt-3">
            <Link
              href="/agendar"
              target="_blank"
              className="text-cyan-700 underline hover:text-cyan-800"
            >
              Agendar nueva cita
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Especialista</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((appt) => {
            const service = typeof appt.serviceId === 'object' ? (appt.serviceId as IService) : null;
            const specialist =
              typeof appt.specialistId === 'object' ? (appt.specialistId as ISpecialist) : null;
            return (
              <TableRow key={appt._id}>
                <TableCell>{formatDate(appt.date)}</TableCell>
                <TableCell className="font-mono text-sm">{appt.time}</TableCell>
                <TableCell>{service?.name ?? '—'}</TableCell>
                <TableCell>{specialist?.name ?? '—'}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={STATUS_COLORS[appt.status] ?? 'bg-slate-200 text-slate-700'}
                  >
                    {appt.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-right text-slate-900">{children}</span>
    </div>
  );
}

function TagList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      {items.length === 0 ? (
        <span className="text-sm text-slate-500">Ninguno registrado</span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, idx) => (
            <Badge key={`${item}-${idx}`} variant="secondary" className="bg-slate-100 text-slate-800">
              {item}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-10 text-center">
        <p className="text-base font-medium text-slate-900">{title}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}
