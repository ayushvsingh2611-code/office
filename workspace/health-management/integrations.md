# 🌐 External Integration & API Contract Spec — CarePulse Health Management
**Integration Engineer:** Brook (Soul of Integrations)
**Scope:** "External Clinical Services, Telemetry Streams & HL7/FHIR Gateways"

---

## 1. System Integration Landscape

CarePulse communicates with external hospital ancillary systems through standardized clinical data bridges:

```
                          ┌────────────────────────────┐
                          │   CarePulse Client Core    │
                          └─────────────┬──────────────┘
                                        │
      ┌──────────────────┬──────────────┴──────────────┬──────────────────┐
      │                  │                             │                  │
      ▼                  ▼                             ▼                  ▼
┌─────────────┐   ┌─────────────┐               ┌─────────────┐   ┌─────────────┐
│  HL7 / FHIR │   │   Central   │               │   Philips   │   │     SMS &   │
│ R4 Gateway  │   │  Pharmacy   │               │  IntelliVue │   │   WhatsApp  │
│  (EHR Sync) │   │  Dispensing │               │   ECG Feed  │   │ Dispatcher  │
└─────────────┘   └─────────────┘               └─────────────┘   └─────────────┘
```

---

## 2. API Contract Specifications

### 2.1 FHIR R4 Appointment Resource Bridge
- **Endpoint:** `POST /fhir/R4/Appointment`
- **Protocol:** HTTPS REST / JSON
- **Headers:** `Authorization: Bearer <TOKEN>`, `Content-Type: application/fhir+json`
- **Payload Contract:**
```json
{
  "resourceType": "Appointment",
  "id": "APT-8821",
  "status": "booked",
  "serviceCategory": [{ "coding": [{ "system": "http://carepulse.health/dept", "code": "CARDIO" }] }],
  "participant": [
    { "actor": { "reference": "Practitioner/doc-1", "display": "Dr. Sarah Jenkins" }, "status": "accepted" },
    { "actor": { "reference": "Patient/CP-8842", "display": "Arjun Mehta" }, "status": "accepted" }
  ],
  "start": "2026-11-05T11:00:00+05:30",
  "end": "2026-11-05T11:30:00+05:30"
}
```

### 2.2 Hospital Pharmacy Dispense Requisition
- **Endpoint:** `POST /api/v1/pharmacy/requisitions`
- **Trigger:** Click on "Request Refill" or "Dispense to Ward"
- **Payload:**
```json
{
  "requisitionId": "REQ-2026-9912",
  "patientId": "CP-8842",
  "prescriptionId": "RX-701",
  "drugCode": "PH-101",
  "medicine": "Atorvastatin Calcium 20mg",
  "quantity": 30,
  "priority": "Routine",
  "dispatchedBy": "Patient Portal Self-Service"
}
```

### 2.3 Philips IntelliVue MX800 Real-Time Physiological Telemetry
- **Protocol:** WebSocket Stream / Canvas 60 FPS
- **Frame Rate:** 25 mm/sec surface ECG Lead II
- **Payload Contract:**
```json
{
  "timestamp": 1793725000000,
  "patientId": "CP-8842",
  "lead": "II",
  "heartRate": 72,
  "rhythm": "Sinus Rhythm",
  "bloodPressure": { "systolic": 120, "diastolic": 80, "mean": 93 },
  "spo2": 99,
  "bodyTemperature": 98.4,
  "respiratoryRate": 16
}
```

### 2.4 Outpatient Notification Dispatch Gateway (Twilio / Gupshup)
- **Protocol:** Webhook Push
- **Events:**
  - `appointment.confirmed`: Sends SMS & WhatsApp pass with token link.
  - `appointment.cancelled`: Dispatches cancellation receipt and frees slot.
  - `icu.emergency_admitted`: Alerts on-call intensivist team.

---

*Integration Architecture Signed Off by Brook (Integration Specialist).*
