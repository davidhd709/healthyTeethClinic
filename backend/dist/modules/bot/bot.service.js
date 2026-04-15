"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const services_service_1 = require("../services/services.service");
const specialists_service_1 = require("../specialists/specialists.service");
const availability_service_1 = require("../availability/availability.service");
const appointments_service_1 = require("../appointments/appointments.service");
let BotService = class BotService {
    constructor(servicesService, specialistsService, availabilityService, appointmentsService) {
        this.servicesService = servicesService;
        this.specialistsService = specialistsService;
        this.availabilityService = availabilityService;
        this.appointmentsService = appointmentsService;
        this.monthMap = {
            enero: 0,
            febrero: 1,
            marzo: 2,
            abril: 3,
            mayo: 4,
            junio: 5,
            julio: 6,
            agosto: 7,
            septiembre: 8,
            setiembre: 8,
            octubre: 9,
            noviembre: 10,
            diciembre: 11,
        };
        this.serviceAliases = {
            limpieza: 'odontologia-general',
            caries: 'odontologia-general',
            brackets: 'ortodoncia',
            alineadores: 'ortodoncia',
            blanqueamiento: 'blanqueamiento-dental',
            estetica: 'estetica-dental',
            implantes: 'implantologia',
            implante: 'implantologia',
            ninos: 'odontopediatria',
            niños: 'odontopediatria',
            conducto: 'endodoncia',
        };
    }
    async listServices() {
        const services = await this.servicesService.findAll();
        return services.map((s) => ({
            id: s._id.toString(),
            name: s.name,
            slug: s.slug,
            description: s.description,
            durationMinutes: s.durationMinutes,
            basePrice: s.basePrice,
        }));
    }
    async listSpecialists(serviceId) {
        const specialists = await this.specialistsService.findAll();
        const extractId = (svc) => {
            if (typeof svc === 'string')
                return svc;
            if (svc && typeof svc === 'object') {
                const obj = svc;
                if (obj._id)
                    return String(obj._id);
            }
            return String(svc);
        };
        const filtered = serviceId
            ? specialists.filter((sp) => sp.services.some((svc) => extractId(svc) === serviceId))
            : specialists;
        return filtered.map((sp) => ({
            id: sp._id.toString(),
            name: sp.name,
            slug: sp.slug,
            specialty: sp.specialty,
            subspecialty: sp.subspecialty,
            experience: sp.experience,
            serviceIds: sp.services.map((s) => extractId(s)),
        }));
    }
    async getAvailability(specialistId, date) {
        return this.availabilityService.getAvailability(specialistId, date);
    }
    async createAppointment(dto) {
        const appointment = await this.appointmentsService.create(dto);
        return {
            success: true,
            appointmentId: appointment._id.toString(),
            message: 'Cita agendada exitosamente. Recibirás un correo de confirmación.',
            date: dto.date,
            time: dto.time,
        };
    }
    async formatServicesText() {
        const services = await this.listServices();
        if (services.length === 0)
            return 'No hay servicios disponibles.';
        return services
            .map((s) => `🦷 ${s.name} - ${s.durationMinutes} min${s.basePrice ? ` - desde $${s.basePrice.toLocaleString('es-CO')} COP` : ''}`)
            .join('\n');
    }
    async formatSpecialistsText(serviceId) {
        const specialists = await this.listSpecialists(serviceId);
        if (specialists.length === 0)
            return 'No hay especialistas disponibles para este servicio.';
        return specialists
            .map((sp) => `👨‍⚕️ ${sp.name} - ${sp.specialty}${sp.subspecialty ? ` (${sp.subspecialty})` : ''} - ${sp.experience} años`)
            .join('\n');
    }
    async processBookingTurn(message, incomingState) {
        const text = (message ?? '').trim();
        const normalizedText = this.normalizeText(text);
        const state = this.initBookingState(incomingState);
        if (state.appointmentId) {
            return {
                reply: 'Tu cita ya fue confirmada ✅. Si deseas, también puedo ayudarte a agendar una nueva.',
                state,
                missingFields: [],
                completed: true,
                appointment: {
                    id: state.appointmentId,
                    date: state.date ?? '',
                    time: state.time ?? '',
                    serviceName: state.serviceName,
                    specialistName: state.specialistName,
                },
            };
        }
        const missing = this.getMissingFields(state);
        const currentStep = missing[0];
        if (!text) {
            return this.replyForCurrentStep(state);
        }
        const asksForServices = this.containsAny(normalizedText, [
            'servicios',
            'que ofrecen',
            'qué ofrecen',
        ]);
        const asksForSpecialists = this.containsAny(normalizedText, [
            'especialistas',
            'doctor',
            'doctora',
            'odontologo',
            'odontóloga',
            'odontologo',
            'odontologa',
        ]);
        if (currentStep === 'patientName') {
            const maybeName = this.extractName(text);
            if (maybeName) {
                state.patientName = maybeName;
            }
            else if (asksForServices) {
                return this.replyWithServicesAndKeepStep(state);
            }
            else {
                return this.replyForCurrentStep(state);
            }
        }
        else if (currentStep === 'patientEmail') {
            const email = this.extractEmail(text);
            if (email) {
                state.patientEmail = email;
            }
            else if (asksForServices) {
                return this.replyWithServicesAndKeepStep(state);
            }
            else {
                return this.replyForCurrentStep(state);
            }
        }
        else if (currentStep === 'patientPhone') {
            const phone = this.extractPhone(text);
            if (phone) {
                state.patientPhone = phone;
            }
            else if (asksForServices) {
                return this.replyWithServicesAndKeepStep(state);
            }
            else {
                return this.replyForCurrentStep(state);
            }
        }
        else if (currentStep === 'serviceId') {
            if (asksForServices) {
                return this.replyWithServicesAndKeepStep(state);
            }
            const serviceResolution = await this.resolveService(text);
            if (!serviceResolution.value) {
                if (serviceResolution.options?.length) {
                    const optionsText = serviceResolution.options
                        .slice(0, 5)
                        .map((service) => `- ${service.name}`)
                        .join('\n');
                    return {
                        reply: `Encontré varias opciones parecidas:\n${optionsText}\n\n¿Cuál servicio deseas agendar?`,
                        state,
                        missingFields: this.getMissingFields(state),
                        completed: false,
                    };
                }
                return this.replyWithServicesAndKeepStep(state);
            }
            state.serviceId = serviceResolution.value.id;
            state.serviceName = serviceResolution.value.name;
            state.specialistId = undefined;
            state.specialistName = undefined;
            const specialists = await this.listSpecialists(state.serviceId);
            if (specialists.length === 1) {
                state.specialistId = specialists[0].id;
                state.specialistName = specialists[0].name;
            }
        }
        else if (currentStep === 'specialistId') {
            if (!state.serviceId) {
                return this.replyForCurrentStep(state);
            }
            const specialists = await this.listSpecialists(state.serviceId);
            if (specialists.length === 0) {
                return {
                    reply: 'No encontré especialistas activos para ese servicio ahora mismo. ¿Quieres elegir otro servicio?',
                    state: {
                        ...state,
                        serviceId: undefined,
                        serviceName: undefined,
                    },
                    missingFields: ['serviceId', ...this.getMissingFields(state)],
                    completed: false,
                };
            }
            if (this.containsAny(normalizedText, ['cualquiera', 'cualquiera esta bien', 'sin preferencia'])) {
                state.specialistId = specialists[0].id;
                state.specialistName = specialists[0].name;
            }
            else if (asksForSpecialists) {
                const specialistsText = specialists
                    .map((sp) => `- ${sp.name} (${sp.specialty})`)
                    .join('\n');
                return {
                    reply: `Tenemos estos especialistas disponibles:\n${specialistsText}\n\n¿Cuál prefieres?`,
                    state,
                    missingFields: this.getMissingFields(state),
                    completed: false,
                };
            }
            else {
                const specialistResolution = await this.resolveSpecialist(text, specialists);
                if (!specialistResolution.value) {
                    const specialistsText = specialists
                        .map((sp) => `- ${sp.name}`)
                        .slice(0, 6)
                        .join('\n');
                    return {
                        reply: `No logré identificar el especialista.\nPuedes elegir uno de esta lista:\n${specialistsText}`,
                        state,
                        missingFields: this.getMissingFields(state),
                        completed: false,
                    };
                }
                state.specialistId = specialistResolution.value.id;
                state.specialistName = specialistResolution.value.name;
            }
        }
        else if (currentStep === 'date') {
            const parsedDate = this.extractDate(text);
            if (!parsedDate) {
                return {
                    reply: 'Por favor indícame una fecha válida en formato YYYY-MM-DD (por ejemplo 2026-04-20), o escribe "mañana".',
                    state,
                    missingFields: this.getMissingFields(state),
                    completed: false,
                };
            }
            state.date = parsedDate;
        }
        else if (currentStep === 'time') {
            const parsedTime = this.extractTime(text);
            if (!parsedTime) {
                return {
                    reply: 'Indícame la hora en formato HH:mm, por ejemplo 09:30.',
                    state,
                    missingFields: this.getMissingFields(state),
                    completed: false,
                };
            }
            if (state.specialistId && state.date) {
                const availability = await this.availabilityService.getAvailability(state.specialistId, state.date);
                const slot = availability.slots.find((s) => s.time === parsedTime);
                if (!slot || !slot.available) {
                    const availableTimes = availability.slots
                        .filter((s) => s.available)
                        .slice(0, 8)
                        .map((s) => s.time)
                        .join(', ');
                    return {
                        reply: availableTimes
                            ? `Esa hora no está disponible. Horas disponibles: ${availableTimes}. ¿Cuál prefieres?`
                            : 'No hay horarios disponibles para esa fecha. ¿Quieres intentar con otra fecha?',
                        state,
                        missingFields: this.getMissingFields(state),
                        completed: false,
                    };
                }
            }
            state.time = parsedTime;
        }
        else if (currentStep === 'reasonForVisit') {
            const reason = text.trim();
            if (reason.length < 10) {
                return {
                    reply: 'Cuéntame brevemente el motivo de la consulta (mínimo 10 caracteres), por favor.',
                    state,
                    missingFields: this.getMissingFields(state),
                    completed: false,
                };
            }
            state.reasonForVisit = reason;
        }
        const missingAfterUpdate = this.getMissingFields(state);
        if (missingAfterUpdate.length > 0) {
            return this.replyForCurrentStep(state);
        }
        const dto = {
            patientName: state.patientName ?? '',
            patientEmail: state.patientEmail ?? '',
            patientPhone: state.patientPhone ?? '',
            patientDocument: state.patientDocument,
            serviceId: state.serviceId ?? '',
            specialistId: state.specialistId ?? '',
            date: state.date ?? '',
            time: state.time ?? '',
            reasonForVisit: state.reasonForVisit ?? '',
            dataConsent: state.dataConsent,
        };
        let appointment;
        try {
            appointment = await this.createAppointment(dto);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'No fue posible agendar la cita';
            return {
                reply: `No pude confirmar la cita en este momento: ${errorMessage}. ¿Quieres intentar con otra hora?`,
                state: {
                    ...state,
                    time: undefined,
                },
                missingFields: this.getMissingFields({
                    ...state,
                    time: undefined,
                }),
                completed: false,
            };
        }
        state.appointmentId = appointment.appointmentId;
        return {
            reply: `¡Listo, ${state.patientName}! Tu cita quedó agendada ✅\n\nServicio: ${state.serviceName}\nEspecialista: ${state.specialistName}\nFecha: ${state.date}\nHora: ${state.time}\n\nTe enviaremos la confirmación al correo ${state.patientEmail}.`,
            state,
            missingFields: [],
            completed: true,
            appointment: {
                id: appointment.appointmentId,
                date: state.date ?? '',
                time: state.time ?? '',
                serviceName: state.serviceName,
                specialistName: state.specialistName,
            },
        };
    }
    initBookingState(incomingState) {
        return {
            patientName: incomingState?.patientName?.trim() || undefined,
            patientEmail: incomingState?.patientEmail?.trim() || undefined,
            patientPhone: incomingState?.patientPhone?.trim() || undefined,
            patientDocument: incomingState?.patientDocument?.trim() || undefined,
            serviceId: incomingState?.serviceId?.trim() || undefined,
            serviceName: incomingState?.serviceName?.trim() || undefined,
            specialistId: incomingState?.specialistId?.trim() || undefined,
            specialistName: incomingState?.specialistName?.trim() || undefined,
            date: incomingState?.date?.trim() || undefined,
            time: incomingState?.time?.trim() || undefined,
            reasonForVisit: incomingState?.reasonForVisit?.trim() || undefined,
            dataConsent: incomingState?.dataConsent !== false,
            appointmentId: incomingState?.appointmentId?.trim() || undefined,
        };
    }
    getMissingFields(state) {
        const missing = [];
        if (!state.patientName)
            missing.push('patientName');
        if (!state.patientEmail)
            missing.push('patientEmail');
        if (!state.patientPhone)
            missing.push('patientPhone');
        if (!state.serviceId)
            missing.push('serviceId');
        if (!state.specialistId)
            missing.push('specialistId');
        if (!state.date)
            missing.push('date');
        if (!state.time)
            missing.push('time');
        if (!state.reasonForVisit)
            missing.push('reasonForVisit');
        return missing;
    }
    async replyForCurrentStep(state) {
        const missing = this.getMissingFields(state);
        const step = missing[0];
        if (!step) {
            return {
                reply: 'Perfecto, tengo toda la información para agendar tu cita.',
                state,
                missingFields: [],
                completed: true,
            };
        }
        if (step === 'patientName') {
            return {
                reply: 'Claro, para agendar tu cita necesito tu nombre completo 😊',
                state,
                missingFields: missing,
                completed: false,
            };
        }
        if (step === 'patientEmail') {
            return {
                reply: `Gracias${state.patientName ? `, ${state.patientName}` : ''}. Ahora compárteme tu correo electrónico 📧`,
                state,
                missingFields: missing,
                completed: false,
            };
        }
        if (step === 'patientPhone') {
            return {
                reply: 'Perfecto. Ahora necesito tu número de teléfono 📞',
                state,
                missingFields: missing,
                completed: false,
            };
        }
        if (step === 'serviceId') {
            return this.replyWithServicesAndKeepStep(state);
        }
        if (step === 'specialistId') {
            const specialists = state.serviceId
                ? await this.listSpecialists(state.serviceId)
                : [];
            if (specialists.length === 0) {
                return {
                    reply: 'No encontré especialistas para ese servicio. ¿Quieres elegir otro servicio?',
                    state: {
                        ...state,
                        serviceId: undefined,
                        serviceName: undefined,
                    },
                    missingFields: ['serviceId', ...missing],
                    completed: false,
                };
            }
            const specialistsText = specialists
                .slice(0, 6)
                .map((sp) => `- ${sp.name} (${sp.specialty})`)
                .join('\n');
            return {
                reply: `¿Con qué especialista te gustaría agendar?\n${specialistsText}\n\nSi quieres, escribe "cualquiera".`,
                state,
                missingFields: missing,
                completed: false,
            };
        }
        if (step === 'date') {
            return {
                reply: '¿Para qué fecha deseas la cita? (formato YYYY-MM-DD o escribe "mañana")',
                state,
                missingFields: missing,
                completed: false,
            };
        }
        if (step === 'time') {
            let availabilityText = '¿A qué hora prefieres? (formato HH:mm, por ejemplo 09:30)';
            if (state.specialistId && state.date) {
                const availability = await this.availabilityService.getAvailability(state.specialistId, state.date);
                const availableTimes = availability.slots
                    .filter((s) => s.available)
                    .slice(0, 8)
                    .map((s) => s.time)
                    .join(', ');
                if (availableTimes) {
                    availabilityText = `Estos horarios están disponibles: ${availableTimes}. ¿Cuál prefieres?`;
                }
            }
            return {
                reply: availabilityText,
                state,
                missingFields: missing,
                completed: false,
            };
        }
        return {
            reply: 'Cuéntame brevemente el motivo de tu consulta (por ejemplo: control de brackets, dolor molar, limpieza preventiva).',
            state,
            missingFields: missing,
            completed: false,
        };
    }
    async replyWithServicesAndKeepStep(state) {
        const services = await this.listServices();
        const servicesText = services
            .slice(0, 10)
            .map((service) => `- ${service.name}`)
            .join('\n');
        return {
            reply: `Claro, estos son nuestros servicios:\n${servicesText}\n\n¿Cuál deseas agendar?`,
            state,
            missingFields: this.getMissingFields(state),
            completed: false,
        };
    }
    async resolveService(query) {
        const services = await this.listServices();
        if (!query.trim())
            return {};
        if (/^[a-f0-9]{24}$/i.test(query)) {
            const byId = services.find((s) => s.id === query);
            return byId ? { value: byId } : {};
        }
        const normalizedQuery = this.normalizeText(query);
        if (!normalizedQuery)
            return {};
        const aliasEntry = Object.entries(this.serviceAliases).find(([alias]) => normalizedQuery.includes(this.normalizeText(alias)));
        if (aliasEntry) {
            const byAlias = services.find((s) => s.slug === aliasEntry[1]);
            if (byAlias)
                return { value: byAlias };
        }
        const exact = services.find((service) => this.normalizeText(service.name) === normalizedQuery ||
            this.normalizeText(service.slug) === normalizedQuery);
        if (exact)
            return { value: exact };
        const tokenizedQuery = normalizedQuery
            .split(/\s+/)
            .map((token) => token.trim())
            .filter((token) => token.length > 1);
        const ranked = services
            .map((service) => {
            const normalizedName = this.normalizeText(service.name);
            const normalizedSlug = this.normalizeText(service.slug);
            const scoreFromContains = normalizedName.includes(normalizedQuery) ||
                normalizedSlug.includes(normalizedQuery)
                ? 3
                : 0;
            const overlap = tokenizedQuery.reduce((score, token) => {
                return normalizedName.includes(token) || normalizedSlug.includes(token)
                    ? score + 1
                    : score;
            }, 0);
            return { service, score: scoreFromContains + overlap };
        })
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score);
        if (ranked.length === 0)
            return {};
        if (ranked.length === 1 || ranked[0].score > ranked[1].score) {
            return { value: ranked[0].service };
        }
        return { options: ranked.slice(0, 5).map((entry) => entry.service) };
    }
    async resolveSpecialist(query, specialists) {
        if (!query.trim())
            return {};
        if (/^[a-f0-9]{24}$/i.test(query)) {
            const byId = specialists.find((specialist) => specialist.id === query);
            return byId ? { value: byId } : {};
        }
        const normalizedQuery = this.normalizeText(query);
        if (!normalizedQuery)
            return {};
        const exact = specialists.find((specialist) => this.normalizeText(specialist.name) === normalizedQuery ||
            this.normalizeText(specialist.slug) === normalizedQuery);
        if (exact)
            return { value: exact };
        const ranked = specialists
            .map((specialist) => {
            const normalizedName = this.normalizeText(specialist.name);
            const normalizedSlug = this.normalizeText(specialist.slug);
            const score = (normalizedName.includes(normalizedQuery) ? 2 : 0) +
                (normalizedSlug.includes(normalizedQuery) ? 2 : 0);
            return { specialist, score };
        })
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score);
        if (ranked.length === 0)
            return {};
        if (ranked.length === 1 || ranked[0].score > ranked[1].score) {
            return { value: ranked[0].specialist };
        }
        return { options: ranked.slice(0, 5).map((entry) => entry.specialist) };
    }
    extractEmail(text) {
        const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
        return match ? match[0].toLowerCase() : null;
    }
    extractPhone(text) {
        const digitsOnly = text.replace(/\D/g, '');
        if (digitsOnly.length < 7)
            return null;
        if (digitsOnly.length > 15)
            return null;
        return digitsOnly;
    }
    extractName(text) {
        if (this.extractEmail(text))
            return null;
        if (/\d/.test(text))
            return null;
        const cleaned = text
            .trim()
            .replace(/[^\p{L}\s'.-]/gu, '')
            .replace(/\s+/g, ' ');
        if (cleaned.length < 5)
            return null;
        if (cleaned.split(' ').length < 2)
            return null;
        return cleaned;
    }
    extractTime(text) {
        const match = text.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);
        if (!match)
            return null;
        const hours = match[1].padStart(2, '0');
        const minutes = match[2].padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    extractDate(text) {
        const normalized = this.normalizeText(text);
        const today = this.startOfDay(new Date());
        if (normalized.includes('pasado manana') || normalized.includes('pasadomanana')) {
            const target = new Date(today);
            target.setDate(target.getDate() + 2);
            return this.toIsoDate(target);
        }
        if (normalized.includes('manana')) {
            const target = new Date(today);
            target.setDate(target.getDate() + 1);
            return this.toIsoDate(target);
        }
        if (normalized.includes('hoy')) {
            return this.toIsoDate(today);
        }
        const isoMatch = normalized.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
        if (isoMatch) {
            const candidate = this.buildDate(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
            if (!this.isValidDate(candidate))
                return null;
            if (this.startOfDay(candidate) < today)
                return null;
            return this.toIsoDate(candidate);
        }
        const ddmmyyyyMatch = normalized.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
        if (ddmmyyyyMatch) {
            const day = Number(ddmmyyyyMatch[1]);
            const month = Number(ddmmyyyyMatch[2]) - 1;
            const currentYear = new Date().getFullYear();
            const yearRaw = ddmmyyyyMatch[3];
            const year = yearRaw
                ? Number(yearRaw.length === 2 ? `20${yearRaw}` : yearRaw)
                : currentYear;
            const candidate = this.buildDate(year, month, day);
            if (!this.isValidDate(candidate))
                return null;
            if (this.startOfDay(candidate) < today)
                return null;
            return this.toIsoDate(candidate);
        }
        const ddDeMes = normalized.match(/\b(\d{1,2})\s+de\s+([a-záéíóú]+)(?:\s+de\s+(\d{4}))?\b/u);
        if (ddDeMes) {
            const day = Number(ddDeMes[1]);
            const monthName = this.normalizeText(ddDeMes[2]);
            const month = this.monthMap[monthName];
            if (month === undefined)
                return null;
            const currentYear = new Date().getFullYear();
            const year = ddDeMes[3] ? Number(ddDeMes[3]) : currentYear;
            let candidate = this.buildDate(year, month, day);
            if (!this.isValidDate(candidate))
                return null;
            if (!ddDeMes[3] && this.startOfDay(candidate) < today) {
                candidate = this.buildDate(year + 1, month, day);
            }
            if (this.startOfDay(candidate) < today)
                return null;
            return this.toIsoDate(candidate);
        }
        return null;
    }
    containsAny(haystack, needles) {
        return needles.some((needle) => haystack.includes(this.normalizeText(needle)));
    }
    normalizeText(value) {
        return value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    startOfDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    isValidDate(date) {
        return !Number.isNaN(date.getTime());
    }
    buildDate(year, month, day) {
        const date = new Date(year, month, day);
        if (date.getFullYear() !== year ||
            date.getMonth() !== month ||
            date.getDate() !== day) {
            return new Date('invalid');
        }
        return date;
    }
    toIsoDate(date) {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_service_1.ServicesService,
        specialists_service_1.SpecialistsService,
        availability_service_1.AvailabilityService,
        appointments_service_1.AppointmentsService])
], BotService);
//# sourceMappingURL=bot.service.js.map