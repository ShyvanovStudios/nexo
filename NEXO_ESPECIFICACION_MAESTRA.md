# NEXO — Especificación Funcional, Técnica y de Diseño

> Documento maestro para desarrollo con Claude Code  
> Versión: 1.0  
> Plataforma objetivo principal: Huawei MatePad T  
> Tipo de aplicación: PWA responsive, optimizada para tablet  
> Idioma principal: Español  
> Arquitectura propuesta: React + Vite + TypeScript + Tailwind CSS + Django REST Framework + PostgreSQL

---

# 1. Visión general

## 1.1 Nombre provisional

**NEXO**

El nombre puede ser reemplazado posteriormente sin afectar la arquitectura.

## 1.2 Propósito

NEXO será una aplicación personal de productividad diseñada para centralizar la organización diaria del usuario en distintos ámbitos de su vida.

Ámbitos iniciales:

- Trabajo
- Casa
- Empresa

La aplicación debe integrar en una misma experiencia:

- Gestión de tareas.
- Tablero Kanban.
- Priorización por importancia y urgencia.
- Semáforo visual de prioridades.
- Historial completo de tareas.
- Gestión de tareas pendientes o bloqueadas.
- Calendario.
- Agenda diaria.
- Notas.
- Recordatorios.
- Búsqueda global.
- Bandeja de entrada rápida.
- Estadísticas básicas.

La aplicación debe evitar transformarse en múltiples módulos aislados.

El diseño debe permitir que tareas, agenda, notas e historial estén relacionados entre sí.

---

# 2. Objetivo principal

Permitir que el usuario pueda responder rápidamente las siguientes preguntas:

1. ¿Qué tengo que hacer hoy?
2. ¿Qué es lo más urgente?
3. ¿Qué es lo más importante?
4. ¿Qué tareas están bloqueadas?
5. ¿Por qué están bloqueadas?
6. ¿Qué tengo programado para hoy?
7. ¿Qué cosas importantes he anotado?
8. ¿Qué hice en una fecha determinada?
9. ¿Qué actividades corresponden al Trabajo, Casa o Empresa?
10. ¿Qué tareas están atrasadas?

---

# 3. Principios de diseño

La aplicación debe cumplir los siguientes principios:

## 3.1 Tablet first

La interfaz debe diseñarse primero para una tablet de aproximadamente 10 pulgadas.

La orientación prioritaria será horizontal.

Debe funcionar también en:

- Smartphones.
- Computadores.
- Otros tablets.

## 3.2 Uso táctil

Todos los botones y controles deben ser fáciles de utilizar con los dedos.

Tamaño mínimo recomendado para botones táctiles:

- 44 px de alto.
- Idealmente 48 px.

## 3.3 Baja fricción

Crear una tarea debe ser rápido.

Debe existir un modo de captura rápida mediante una Bandeja de Entrada.

## 3.4 Información visual inmediata

El usuario debe identificar visualmente:

- Prioridad.
- Ámbito.
- Estado.
- Fecha límite.
- Bloqueos.
- Atrasos.

sin necesidad de abrir cada tarea.

## 3.5 Trazabilidad

La aplicación debe mantener historial de los cambios importantes.

## 3.6 Configurabilidad

Los ámbitos y etiquetas deben poder ser configurados.

---

# 4. Módulos principales

La navegación principal tendrá los siguientes módulos:

1. Inicio
2. Mi Día
3. Tareas
4. Agenda
5. Notas
6. Historial
7. Bandeja de Entrada
8. Estadísticas
9. Configuración

---

# 5. Layout general

## 5.1 Tablet horizontal

Utilizar sidebar fija lateral.

Ejemplo conceptual:

```text
┌───────────────┬────────────────────────────────────────────┐
│               │                                            │
│ NEXO          │                                            │
│               │                                            │
│ Inicio        │                                            │
│ Mi Día        │                                            │
│ Tareas        │               CONTENIDO                    │
│ Agenda        │                                            │
│ Notas         │                                            │
│ Historial     │                                            │
│ Inbox         │                                            │
│ Estadísticas  │                                            │
│ Configuración │                                            │
│               │                                            │
│      +        │                                            │
└───────────────┴────────────────────────────────────────────┘
```

## 5.2 Smartphone

En móvil utilizar navegación inferior.

```text
Inicio | Tareas | Agenda | Notas | Más
```

---

# 6. Identidad visual

## 6.1 Estilo

Diseño moderno, limpio y funcional.

No utilizar un estilo excesivamente corporativo.

Inspiraciones conceptuales:

- Trello.
- Todoist.
- Notion.
- Google Calendar.
- Google Keep.
- Microsoft Planner.

No copiar visualmente ninguna aplicación.

## 6.2 Tema

Soportar:

- Tema claro.
- Tema oscuro.

Preferencia del usuario debe persistirse.

## 6.3 Colores de ámbitos

Colores iniciales sugeridos:

- Trabajo: azul.
- Casa: verde.
- Empresa: naranja.

Los colores deben poder modificarse.

## 6.4 Semáforo de prioridad

- Rojo: alta prioridad.
- Amarillo: prioridad media.
- Verde: prioridad baja.
- Gris: sin prioridad o tarea archivada.

No depender únicamente del color.

Añadir siempre:

- Icono.
- Texto.
- Indicador.

---

# 7. Dashboard / Inicio

La pantalla principal debe entregar una visión global.

## 7.1 Elementos

Mostrar:

- Saludo.
- Fecha actual.
- Cantidad de tareas críticas.
- Cantidad de tareas importantes.
- Cantidad de tareas normales.
- Tareas para hoy.
- Próximos eventos.
- Tareas vencidas.
- Tareas bloqueadas.
- Resumen semanal.

Ejemplo:

```text
BUENAS TARDES

🔴 4 críticas
🟡 7 importantes
🟢 12 normales

PARA HOY

🔴 Preparar informe UTP
🔴 Responder Dirección
🟡 Cotizar materiales

PRÓXIMOS EVENTOS

15:30 Reunión TP
Mañana: Pago proveedor

Tareas completadas esta semana: 18
```

## 7.2 Filtros rápidos

Permitir cambiar entre:

- Todos.
- Trabajo.
- Casa.
- Empresa.

---

# 8. Mi Día

Esta debe ser una de las vistas más importantes.

Debe combinar:

- Agenda.
- Tareas.
- Vencimientos.
- Tareas bloqueadas.

Ejemplo:

```text
MI DÍA

URGENTE

🔴 Preparar informe
🔴 Responder Dirección
🔴 Pagar proveedor

IMPORTANTE

🟡 Revisar planificación
🟡 Cotizar materiales

AGENDA

10:30 Reunión UTP
15:30 Reunión TP

PENDIENTES DE OTROS

Cotización muebles
Esperando respuesta de proveedor

Informe estudiantes
Esperando información de Orientación
```

---

# 9. Gestión de tareas

## 9.1 Estados principales

Los estados iniciales serán:

```text
TODO
IN_PROGRESS
BLOCKED
DONE
```

Visualmente:

- Por hacer.
- En proceso.
- Pendiente.
- Completado.

## 9.2 Tablero Kanban

Estructura:

```text
POR HACER | EN PROCESO | PENDIENTE | COMPLETADO
```

Las tarjetas deben poder moverse mediante drag & drop.

Debe funcionar con:

- Mouse.
- Pantalla táctil.

Tecnología sugerida:

```text
@dnd-kit
```

## 9.3 Orden de tareas

Dentro de cada columna:

1. Tareas vencidas.
2. Prioridad alta.
3. Prioridad media.
4. Prioridad baja.
5. Fecha límite más próxima.
6. Fecha de creación.

Permitir también orden manual.

---

# 10. Creación de tareas

Formulario principal:

```text
Título

Ámbito

Descripción

Importancia

Urgencia

Fecha límite

Hora límite

Estado

Etiquetas

Recordatorios
```

## 10.1 Campos obligatorios

Obligatorios:

- Título.
- Ámbito.

Opcionales:

- Descripción.
- Fecha límite.
- Hora.
- Importancia.
- Urgencia.
- Etiquetas.
- Recordatorios.
- Checklist.

---

# 11. Importancia y urgencia

Utilizar una escala de 1 a 3.

## 11.1 Importancia

```text
1 = Baja
2 = Media
3 = Alta
```

## 11.2 Urgencia

```text
1 = Baja
2 = Media
3 = Alta
```

## 11.3 Prioridad base

Calcular:

```text
priority_score = importance * urgency
```

Resultado:

| Importancia | Urgencia | Score | Nivel |
|---|---:|---:|---|
| Alta | Alta | 9 | Rojo |
| Alta | Media | 6 | Rojo |
| Media | Alta | 6 | Rojo |
| Media | Media | 4 | Amarillo |
| Alta | Baja | 3 | Amarillo |
| Baja | Alta | 3 | Amarillo |
| Baja | Media | 2 | Verde |
| Media | Baja | 2 | Verde |
| Baja | Baja | 1 | Verde |

---

# 12. Prioridad dinámica

La prioridad debe poder aumentar automáticamente según la proximidad de la fecha límite.

Ejemplo conceptual:

```text
> 7 días
sin modificación

4 a 7 días
+1

2 a 3 días
+2

24 horas
+3

vencida
prioridad crítica
```

Se recomienda separar:

```text
base_priority_score
effective_priority_score
```

La prioridad efectiva será utilizada para ordenar visualmente las tareas.

---

# 13. Matriz de Eisenhower

Debe existir una vista alternativa.

Cuatro cuadrantes:

```text
IMPORTANTE + URGENTE
HACER AHORA

IMPORTANTE + NO URGENTE
PLANIFICAR

NO IMPORTANTE + URGENTE
REVISAR / DELEGAR

NO IMPORTANTE + NO URGENTE
BAJA PRIORIDAD
```

Esta vista será opcional dentro del módulo Tareas.

---

# 14. Estado pendiente / bloqueado

Cuando una tarea pase a:

```text
BLOCKED
```

debe abrirse automáticamente un modal.

## 14.1 Motivo obligatorio

Opciones:

- Esperando respuesta.
- Dependo de otra persona.
- Falta información.
- Falta presupuesto.
- Reprogramada.
- Problema técnico.
- Otro.

## 14.2 Observación

Campo de texto:

```text
block_reason_detail
```

Ejemplo:

```text
Esperando aprobación de Dirección para poder continuar.
```

## 14.3 Fecha

Registrar:

```text
blocked_at
```

---

# 15. Historial de tareas

Cada tarea debe mantener un historial.

Registrar eventos como:

- Creación.
- Cambio de estado.
- Cambio de prioridad.
- Cambio de ámbito.
- Cambio de fecha límite.
- Checklist completado.
- Bloqueo.
- Desbloqueo.
- Finalización.
- Reapertura.
- Cambio de título.
- Cambio de descripción.

Ejemplo:

```text
21/09/2026 14:25
Tarea creada

21/09/2026 14:30
Por hacer → En proceso

22/09/2026 09:10
En proceso → Pendiente

Motivo:
Esperando respuesta de Dirección.
```

---

# 16. Checklist

Cada tarea puede contener subtareas.

Modelo:

```text
ChecklistItem

id
task_id
text
is_completed
position
created_at
completed_at
```

Ejemplo:

```text
☑ Obtener estadísticas
☑ Revisar matrícula
☐ Crear gráficos
☐ Preparar presentación
```

Mostrar porcentaje:

```text
2 / 4
50 %
```

---

# 17. Etiquetas

Las tareas pueden contener múltiples etiquetas.

Ejemplos Trabajo:

- UTP
- Dirección
- Docentes
- Estudiantes
- Prácticas
- Titulación
- Reuniones
- Informes

Ejemplos Casa:

- Compras
- Mantención
- Pagos
- Limpieza
- Mascotas

Ejemplos Empresa:

- Finanzas
- Proveedores
- Clientes
- Ventas
- Compras
- Administración
- Marketing

Las etiquetas deben ser editables.

---

# 18. Ámbitos

Entidad independiente.

Campos:

```text
id
name
color
icon
position
is_active
created_at
updated_at
```

Ámbitos iniciales:

```text
Trabajo
Casa
Empresa
```

Permitir crear nuevos ámbitos posteriormente.

---

# 19. Calendario

El calendario debe soportar:

- Mes.
- Semana.
- Día.
- Agenda.

## 19.1 Vista mensual

Mostrar eventos y tareas con fecha límite.

## 19.2 Vista semanal

Mostrar horarios.

## 19.3 Vista diaria

Mostrar agenda cronológica.

## 19.4 Agenda

Listado:

```text
08:00 Revisión coordinación
10:30 Reunión Dirección
15:30 Reunión docentes
19:00 Comprar supermercado
```

---

# 20. Relación tareas-calendario

Toda tarea con:

```text
due_date
```

debe aparecer automáticamente en el calendario.

Debe diferenciarse visualmente entre:

- Evento.
- Tarea.

Al tocar una tarea desde el calendario:

```text
abrir TaskDetail
```

---

# 21. Eventos

Entidad separada.

Campos principales:

```text
id
title
description
scope_id
start_datetime
end_datetime
all_day
location
reminder
created_at
updated_at
```

Eventos pueden no estar asociados a tareas.

Ejemplo:

```text
Reunión con Dirección
23/09/2026
15:30 - 16:30
```

---

# 22. Notas

Sistema inspirado conceptualmente en Google Keep y Notion, pero simplificado.

Cada nota debe permitir:

- Título.
- Texto.
- Ámbito.
- Etiquetas.
- Fijar nota.
- Checklist.
- Adjuntar archivos.
- Relacionar con tareas.
- Crear tareas desde notas.

Campos:

```text
id
title
content
scope_id
is_pinned
created_at
updated_at
```

---

# 23. Conversión nota → tarea

Desde una nota:

```text
Convertir en tarea
```

Debe crear una tarea copiando:

- Título.
- Contenido.
- Ámbito.
- Etiquetas.

La nota original no debe eliminarse.

---

# 24. Bandeja de Entrada

La Bandeja de Entrada permitirá capturar rápidamente información.

Ejemplo:

```text
Llamar a Juan por certificación
```

sin completar más campos.

Entidad:

```text
InboxItem

id
content
created_at
processed
```

Después el usuario puede convertirlo en:

- Tarea.
- Evento.
- Nota.

---

# 25. Botón global "+"

Debe estar visible desde cualquier sección.

Al pulsarlo:

```text
Nueva tarea
Nuevo evento
Nueva nota
Agregar a Inbox
```

En tablet puede implementarse como FAB.

---

# 26. Búsqueda global

Debe permitir buscar simultáneamente en:

- Tareas.
- Eventos.
- Notas.
- Historial.

Campo:

```text
Search...
```

Ejemplo:

```text
certificación
```

Resultados agrupados:

```text
TAREAS

EVENTOS

NOTAS

HISTORIAL
```

---

# 27. Filtros

## 27.1 Filtros de tareas

Por:

- Ámbito.
- Estado.
- Prioridad.
- Importancia.
- Urgencia.
- Etiqueta.
- Fecha.
- Vencidas.
- Bloqueadas.
- Completadas.

## 27.2 Filtros rápidos

```text
Todas
Hoy
Esta semana
Vencidas
Bloqueadas
Alta prioridad
```

---

# 28. Recordatorios

Tipos:

- Minutos antes.
- Horas antes.
- Día anterior.
- Fecha personalizada.

Ejemplo:

```text
1 día antes
1 hora antes
15 minutos antes
```

Implementación inicial PWA:

```text
Web Notifications API
```

Debe contemplarse que algunos navegadores o dispositivos pueden limitar notificaciones en segundo plano.

En fases posteriores se puede incorporar:

```text
Web Push Notifications
```

---

# 29. Tareas recurrentes

No son obligatorias para MVP inicial, pero la arquitectura debe permitir incorporarlas.

Frecuencias:

- Diaria.
- Semanal.
- Mensual.
- Anual.
- Personalizada.

Campos futuros:

```text
recurrence_type
recurrence_interval
recurrence_end_date
```

---

# 30. Estadísticas

Primera versión:

Mostrar:

- Tareas completadas esta semana.
- Tareas vencidas.
- Tareas bloqueadas.
- Tareas activas.
- Distribución por ámbito.
- Distribución por prioridad.

Ejemplo:

```text
ESTA SEMANA

37 completadas
4 vencidas
6 bloqueadas

TRABAJO    61 %
CASA       18 %
EMPRESA    21 %
```

---

# 31. Arquitectura tecnológica

## 31.1 Frontend

```text
React
Vite
TypeScript
Tailwind CSS
React Router
TanStack Query
dnd-kit
Zustand
React Hook Form
Zod
date-fns
```

Opcional:

```text
shadcn/ui
```

para componentes reutilizables.

## 31.2 Backend

```text
Python
Django
Django REST Framework
```

## 31.3 Base de datos

```text
PostgreSQL
```

## 31.4 Autenticación

Primera versión personal:

```text
JWT
```

Librería recomendada:

```text
djangorestframework-simplejwt
```

---

# 32. Arquitectura general

```text
Huawei MatePad
      │
      │ HTTPS
      ▼
React PWA
      │
      │ REST API
      ▼
Django REST Framework
      │
      ▼
PostgreSQL
```

---

# 33. PWA

La aplicación debe poder instalarse desde el navegador.

Debe incluir:

```text
manifest.webmanifest
service worker
icons
offline fallback
```

Usar:

```text
vite-plugin-pwa
```

Debe funcionar como aplicación instalada en pantalla de inicio.

---

# 34. Soporte offline

El objetivo es permitir al menos:

- Abrir aplicación.
- Ver datos previamente cargados.
- Crear tareas localmente.
- Crear notas localmente.

Posteriormente sincronizar con backend.

Arquitectura recomendada:

```text
IndexedDB
```

Utilizar:

```text
Dexie.js
```

como capa de abstracción.

La sincronización offline avanzada puede implementarse después del MVP.

---

# 35. Modelo de datos

## 35.1 User

```text
User
--------------------
id
username
email
password_hash
first_name
last_name
created_at
updated_at
```

---

## 35.2 Scope

```text
Scope
--------------------
id
user_id
name
color
icon
position
is_active
created_at
updated_at
```

---

## 35.3 Task

```text
Task
-------------------------
id
user_id
scope_id

title
description

status

importance
urgency

base_priority_score
effective_priority_score

due_date
due_time

started_at
blocked_at
completed_at

block_reason
block_reason_detail

position

is_archived

created_at
updated_at
```

---

## 35.4 TaskHistory

```text
TaskHistory
-------------------------
id
task_id
user_id

event_type

previous_value
new_value

comment

created_at
```

---

## 35.5 ChecklistItem

```text
ChecklistItem
-------------------------
id
task_id
text
is_completed
position
created_at
completed_at
```

---

## 35.6 Tag

```text
Tag
-------------------------
id
user_id
name
color
created_at
```

---

## 35.7 TaskTag

```text
TaskTag
-------------------------
task_id
tag_id
```

---

## 35.8 Event

```text
Event
-------------------------
id
user_id
scope_id

title
description

start_datetime
end_datetime

all_day
location

created_at
updated_at
```

---

## 35.9 Note

```text
Note
-------------------------
id
user_id
scope_id

title
content

is_pinned

created_at
updated_at
```

---

## 35.10 NoteTag

```text
NoteTag
-------------------------
note_id
tag_id
```

---

## 35.11 InboxItem

```text
InboxItem
-------------------------
id
user_id
content
processed
created_at
processed_at
```

---

## 35.12 Reminder

```text
Reminder
-------------------------
id
user_id
task_id
event_id

remind_at
notification_sent

created_at
```

---

# 36. Estados de tarea

Enum:

```text
TODO
IN_PROGRESS
BLOCKED
DONE
```

No utilizar estados como strings arbitrarios.

---

# 37. Motivos de bloqueo

Enum inicial:

```text
WAITING_RESPONSE
DEPENDENCY
MISSING_INFORMATION
MISSING_BUDGET
RESCHEDULED
TECHNICAL_PROBLEM
OTHER
```

---

# 38. Tipos de evento histórico

Enum:

```text
TASK_CREATED
TITLE_CHANGED
DESCRIPTION_CHANGED
STATUS_CHANGED
PRIORITY_CHANGED
SCOPE_CHANGED
DUE_DATE_CHANGED
TASK_BLOCKED
TASK_UNBLOCKED
CHECKLIST_UPDATED
TASK_COMPLETED
TASK_REOPENED
TASK_ARCHIVED
```

---

# 39. API REST propuesta

Base:

```text
/api/v1/
```

---

## 39.1 Auth

```text
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/logout/
GET  /api/v1/auth/me/
```

---

## 39.2 Scopes

```text
GET    /api/v1/scopes/
POST   /api/v1/scopes/
GET    /api/v1/scopes/{id}/
PATCH  /api/v1/scopes/{id}/
DELETE /api/v1/scopes/{id}/
```

---

## 39.3 Tasks

```text
GET    /api/v1/tasks/
POST   /api/v1/tasks/
GET    /api/v1/tasks/{id}/
PATCH  /api/v1/tasks/{id}/
DELETE /api/v1/tasks/{id}/
```

Acciones:

```text
POST /api/v1/tasks/{id}/start/
POST /api/v1/tasks/{id}/block/
POST /api/v1/tasks/{id}/unblock/
POST /api/v1/tasks/{id}/complete/
POST /api/v1/tasks/{id}/reopen/
```

---

## 39.4 Checklist

```text
GET    /api/v1/tasks/{task_id}/checklist/
POST   /api/v1/tasks/{task_id}/checklist/
PATCH  /api/v1/checklist/{id}/
DELETE /api/v1/checklist/{id}/
```

---

## 39.5 Historial

```text
GET /api/v1/tasks/{id}/history/
GET /api/v1/history/
```

---

## 39.6 Tags

```text
GET    /api/v1/tags/
POST   /api/v1/tags/
PATCH  /api/v1/tags/{id}/
DELETE /api/v1/tags/{id}/
```

---

## 39.7 Events

```text
GET    /api/v1/events/
POST   /api/v1/events/
GET    /api/v1/events/{id}/
PATCH  /api/v1/events/{id}/
DELETE /api/v1/events/{id}/
```

---

## 39.8 Notes

```text
GET    /api/v1/notes/
POST   /api/v1/notes/
GET    /api/v1/notes/{id}/
PATCH  /api/v1/notes/{id}/
DELETE /api/v1/notes/{id}/
```

---

## 39.9 Inbox

```text
GET    /api/v1/inbox/
POST   /api/v1/inbox/
DELETE /api/v1/inbox/{id}/
```

Conversiones:

```text
POST /api/v1/inbox/{id}/to-task/
POST /api/v1/inbox/{id}/to-note/
POST /api/v1/inbox/{id}/to-event/
```

---

## 39.10 Dashboard

```text
GET /api/v1/dashboard/
```

Respuesta aproximada:

```json
{
  "today_tasks": [],
  "overdue_tasks": [],
  "blocked_tasks": [],
  "upcoming_events": [],
  "stats": {}
}
```

---

# 40. Frontend — estructura propuesta

```text
frontend/

src/

├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── task/
│   ├── calendar/
│   ├── notes/
│   └── common/
│
├── features/
│   ├── dashboard/
│   ├── tasks/
│   ├── calendar/
│   ├── notes/
│   ├── history/
│   ├── inbox/
│   ├── stats/
│   └── settings/
│
├── hooks/
│
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── tasks.ts
│   ├── calendar.ts
│   └── notes.ts
│
├── stores/
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── filterStore.ts
│
├── types/
│
├── utils/
│
├── styles/
│
└── main.tsx
```

---

# 41. Backend — estructura propuesta

```text
backend/

config/

apps/

├── users/
├── scopes/
├── tasks/
├── calendar/
├── notes/
├── inbox/
└── analytics/
```

Cada app Django debería seguir:

```text
models.py
serializers.py
views.py
urls.py
services.py
selectors.py
tests/
```

---

# 42. Service layer

Evitar colocar lógica compleja directamente en:

- views.
- serializers.
- models.

Ejemplo:

```text
tasks/services.py
```

Funciones:

```python
create_task()
change_task_status()
block_task()
complete_task()
calculate_priority()
create_task_history()
```

---

# 43. Selector layer

Lecturas complejas:

```text
tasks/selectors.py
```

Ejemplo:

```python
get_today_tasks()
get_overdue_tasks()
get_blocked_tasks()
get_priority_tasks()
```

---

# 44. Componentes frontend principales

## Layout

```text
AppShell
Sidebar
Topbar
MobileNavbar
GlobalCreateButton
```

## Tareas

```text
TaskBoard
TaskColumn
TaskCard
TaskForm
TaskDetail
TaskHistory
Checklist
PriorityBadge
ScopeBadge
BlockTaskModal
```

## Calendario

```text
CalendarView
MonthView
WeekView
DayView
AgendaView
EventForm
```

## Notas

```text
NotesGrid
NoteCard
NoteEditor
```

## Dashboard

```text
DashboardSummary
TodayTasks
UpcomingEvents
BlockedTasks
StatsSummary
```

---

# 45. TaskCard

Cada tarjeta debe mostrar:

- Título.
- Ámbito.
- Prioridad.
- Fecha límite.
- Etiquetas principales.
- Progreso checklist.
- Icono si está bloqueada.

Ejemplo:

```text
┌────────────────────────────┐
│ 🔴 Preparar informe TP     │
│                            │
│ Trabajo                    │
│ 📅 25 Sep                  │
│ ☑ 2/5                      │
│ UTP · Informe              │
└────────────────────────────┘
```

---

# 46. TaskDetail

Abrir como:

- Drawer lateral en tablet.
- Modal full-screen en móvil.

Debe contener:

```text
Título
Estado
Ámbito
Prioridad
Descripción
Fecha
Checklist
Etiquetas
Recordatorios
Historial
```

---

# 47. Drag & Drop

Usar:

```text
dnd-kit
```

Debe permitir:

```text
TODO → IN_PROGRESS
IN_PROGRESS → BLOCKED
BLOCKED → IN_PROGRESS
IN_PROGRESS → DONE
DONE → IN_PROGRESS
```

Cuando destino sea:

```text
BLOCKED
```

mostrar modal antes de confirmar.

Si cancela modal:

```text
revertir movimiento
```

---

# 48. Diseño responsive

Breakpoints sugeridos:

```text
mobile  < 768
tablet  768 - 1199
desktop >= 1200
```

Tablet será diseño principal.

---

# 49. Accesibilidad

Debe cumplir:

- Contraste adecuado.
- Navegación por teclado.
- aria-label.
- focus-visible.
- Botones táctiles grandes.
- No depender exclusivamente de colores.

---

# 50. Formato de fechas

Formato visual:

```text
DD/MM/YYYY
```

Internamente:

```text
ISO 8601
```

Zona horaria inicial:

```text
America/Santiago
```

---

# 51. Confirmaciones

Solicitar confirmación antes de:

- Eliminar tarea.
- Eliminar nota.
- Eliminar evento.
- Vaciar historial.
- Archivar múltiples tareas.

No solicitar confirmación para operaciones fácilmente reversibles.

---

# 52. Archivado

Las tareas completadas no deben permanecer indefinidamente en el tablero.

Después de cierto tiempo se podrán archivar.

Estado:

```text
is_archived = true
```

No eliminar físicamente.

---

# 53. Soft delete

Se recomienda utilizar soft delete para:

- Tasks.
- Notes.
- Events.

Campos:

```text
deleted_at
```

---

# 54. Seguridad

Requisitos:

- HTTPS.
- JWT.
- Refresh tokens.
- CORS restringido.
- Validación backend.
- Rate limit login.
- Password hashing Django.
- No almacenar tokens críticos en localStorage si se puede evitar.

Para producción considerar cookies:

```text
HttpOnly
Secure
SameSite
```

---

# 55. Testing

Backend:

```text
pytest
pytest-django
```

Frontend:

```text
Vitest
React Testing Library
```

E2E:

```text
Playwright
```

---

# 56. Casos críticos de prueba

## Tareas

- Crear tarea.
- Editar tarea.
- Eliminar tarea.
- Mover tarea.
- Bloquear tarea.
- Completar tarea.
- Reabrir tarea.
- Calcular prioridad.
- Reordenar tarea.
- Cambiar ámbito.

## Calendario

- Crear evento.
- Editar evento.
- Eliminar evento.
- Mostrar tarea con fecha límite.

## Notas

- Crear nota.
- Editar nota.
- Fijar nota.
- Convertir nota a tarea.

## Inbox

- Crear captura.
- Convertir captura a tarea.
- Convertir captura a nota.

---

# 57. MVP

El MVP debe incluir únicamente lo necesario para que la aplicación sea útil diariamente.

## Sprint 1 — Base

- Proyecto frontend.
- Proyecto backend.
- Base de datos.
- Autenticación.
- Layout.
- PWA.
- Ámbitos.

## Sprint 2 — Tareas

- CRUD tareas.
- Importancia.
- Urgencia.
- Prioridad.
- Estados.
- Filtros.

## Sprint 3 — Kanban

- Tablero.
- Drag & drop.
- Estado pendiente.
- Motivos de bloqueo.
- Historial.

## Sprint 4 — Checklist y etiquetas

- Checklist.
- Etiquetas.
- Buscador.
- TaskDetail.

## Sprint 5 — Calendario

- Vista mensual.
- Vista semanal.
- Vista diaria.
- Eventos.
- Tareas con fecha límite.

## Sprint 6 — Notas

- CRUD notas.
- Notas fijadas.
- Conversión nota → tarea.

## Sprint 7 — Dashboard

- Inicio.
- Mi Día.
- Próximos eventos.
- Tareas vencidas.
- Bloqueadas.

## Sprint 8 — Inbox

- Captura rápida.
- Conversión a tarea.
- Conversión a nota.
- Conversión a evento.

## Sprint 9 — PWA / optimización tablet

- Instalación.
- Responsive.
- Gestos táctiles.
- Cache.
- Offline básico.

---

# 58. Fuera del MVP

No desarrollar inicialmente:

- IA.
- Integración con correo.
- Integración con Google Calendar.
- Colaboración multiusuario.
- Chat.
- Proyectos complejos.
- Facturación.
- Gestión empresarial avanzada.
- Automatizaciones complejas.
- Estadísticas avanzadas.

Diseñar la arquitectura para permitir incorporarlas posteriormente.

---

# 59. Mejoras futuras

## V2

- Tareas recurrentes.
- Adjuntos.
- Recordatorios push.
- Sincronización offline completa.
- Widgets.
- Exportación.

## V3

- Integración Google Calendar.
- Integración Outlook.
- Integración Gmail.
- Integración Microsoft 365.

## V4

Asistente IA:

Ejemplo:

```text
¿Qué tengo pendiente esta semana?
```

```text
¿Qué tareas tengo bloqueadas?
```

```text
Organiza mis tareas de mañana.
```

```text
Convierte estas notas en tareas.
```

---

# 60. Integración futura con IA

Crear interfaz conceptual:

```text
AssistantService
```

para evitar dependencia directa de un proveedor.

Ejemplo:

```typescript
interface AssistantService {
    summarizeTasks(): Promise<string>
    prioritizeTasks(): Promise<Task[]>
    extractTasksFromNote(note: string): Promise<Task[]>
}
```

---

# 61. UX de creación rápida

Desde cualquier pantalla:

```text
+
```

abrirá:

```text
Crear

Tarea
Evento
Nota
Inbox
```

Crear tarea rápida solo requiere:

```text
Título
Ámbito
```

Luego se puede completar información adicional.

---

# 62. Atajos futuros

Desktop:

```text
N = Nueva tarea
E = Nuevo evento
M = Nueva nota
/ = Buscar
```

---

# 63. Dashboard API

Endpoint:

```text
GET /api/v1/dashboard/
```

Debe retornar:

```text
today_tasks
overdue_tasks
blocked_tasks
upcoming_events
priority_summary
weekly_completed
scope_distribution
```

---

# 64. Lógica de vencimiento

Una tarea se considera vencida cuando:

```text
status != DONE
AND due_date < today
```

Si tiene hora:

```text
due_datetime < now
```

---

# 65. Lógica de finalización

Al completar tarea:

```text
status = DONE
completed_at = now()
```

Registrar historial.

Al reabrir:

```text
completed_at = null
```

Registrar:

```text
TASK_REOPENED
```

---

# 66. Lógica de bloqueo

Al bloquear:

```text
status = BLOCKED
blocked_at = now()
block_reason = required
```

Al desbloquear:

```text
blocked_at = null
```

El historial anterior no se elimina.

---

# 67. Permisos

Primera versión:

Cada usuario solamente puede acceder a:

```text
objects where user_id = request.user.id
```

No permitir acceso cruzado.

---

# 68. Seed inicial

Al crear nuevo usuario:

Crear automáticamente ámbitos:

```text
Trabajo
Casa
Empresa
```

Crear algunas etiquetas sugeridas.

---

# 69. Configuración

Pantalla Configuración:

## General

- Nombre.
- Tema.
- Idioma.
- Zona horaria.

## Ámbitos

- Crear.
- Editar.
- Reordenar.
- Desactivar.

## Etiquetas

- Crear.
- Editar.
- Eliminar.

## Notificaciones

- Activar.
- Desactivar.

## Datos

- Exportar.
- Backup.
- Restaurar.

---

# 70. Exportación futura

Formatos:

```text
JSON
CSV
```

Datos exportables:

- Tareas.
- Historial.
- Eventos.
- Notas.

---

# 71. Reglas de desarrollo para Claude Code

Claude Code debe respetar estas reglas:

1. No implementar funcionalidades fuera del alcance actual sin necesidad.
2. No duplicar lógica.
3. Mantener componentes pequeños.
4. Separar UI de lógica.
5. Mantener tipado TypeScript estricto.
6. Evitar `any`.
7. Toda validación crítica debe existir también en backend.
8. Mantener arquitectura modular.
9. Crear tests para lógica crítica.
10. No alterar funcionalidades existentes sin revisar dependencias.
11. Mantener nombres consistentes.
12. Documentar decisiones estructurales importantes.
13. No usar valores mágicos.
14. Centralizar enums.
15. Centralizar configuración.
16. Utilizar variables de entorno.
17. Mantener API versionada.
18. No almacenar secretos en repositorio.
19. Mantener migraciones Django ordenadas.
20. Evitar dependencias innecesarias.

---

# 72. Convención de nombres

Backend Python:

```text
snake_case
```

Clases:

```text
PascalCase
```

Frontend React:

```text
PascalCase
```

Variables JS/TS:

```text
camelCase
```

Constantes:

```text
UPPER_SNAKE_CASE
```

---

# 73. Convención Git sugerida

Ramas:

```text
main
develop
feature/*
fix/*
refactor/*
```

Commits:

```text
feat:
fix:
refactor:
style:
test:
docs:
chore:
```

Ejemplos:

```text
feat: add kanban task board
fix: correct overdue task calculation
refactor: move priority logic to service
```

---

# 74. Variables de entorno

Frontend:

```text
VITE_API_URL=
```

Backend:

```text
SECRET_KEY=
DEBUG=
DATABASE_URL=
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
```

---

# 75. Docker

Preparar proyecto para Docker.

```text
docker-compose.yml
```

Servicios:

```text
frontend
backend
postgres
```

Para producción considerar:

```text
nginx
```

---

# 76. Criterios de éxito del MVP

El MVP se considerará funcional cuando el usuario pueda:

1. Instalar NEXO en su Huawei MatePad.
2. Crear tareas.
3. Asignarlas a Trabajo, Casa o Empresa.
4. Asignar importancia y urgencia.
5. Ver prioridad automática.
6. Mover tareas por Kanban.
7. Bloquear tareas indicando motivo.
8. Consultar historial.
9. Crear eventos.
10. Ver agenda.
11. Crear notas.
12. Consultar Mi Día.
13. Buscar información.
14. Utilizar la aplicación cómodamente mediante pantalla táctil.

---

# 77. Prioridades de desarrollo

Orden obligatorio:

```text
1. Arquitectura
2. Autenticación
3. Ámbitos
4. Tareas
5. Prioridad
6. Kanban
7. Historial
8. Calendario
9. Mi Día
10. Notas
11. Inbox
12. PWA
13. Offline
14. Estadísticas
```

No comenzar por estadísticas, IA o integraciones externas.

---

# 78. Primera tarea recomendada para Claude Code

Claude Code debe comenzar realizando:

```text
1. Crear estructura monorepo.

2. Crear:
   frontend/
   backend/

3. Inicializar React + Vite + TypeScript.

4. Inicializar Django + DRF.

5. Configurar PostgreSQL.

6. Configurar variables de entorno.

7. Crear layout principal responsive.

8. Crear sidebar tablet-first.

9. Crear routing.

10. Crear modelos iniciales:
    User
    Scope
    Task
    TaskHistory

11. Crear migraciones.

12. Crear API CRUD de Scope y Task.

13. Crear pantalla inicial del tablero Kanban.
```

No implementar todavía:

```text
Calendario
Notas
IA
Integraciones externas
```

hasta completar correctamente la gestión de tareas.

---

# 79. Resultado esperado

NEXO debe convertirse en el centro de organización personal del usuario.

No debe funcionar solamente como una lista de tareas.

Debe integrar:

```text
TAREAS
   +
PRIORIDADES
   +
AGENDA
   +
NOTAS
   +
HISTORIAL
   +
ORGANIZACIÓN POR ÁMBITOS
```

en una sola aplicación.

El usuario debería poder abrir la aplicación por la mañana y responder inmediatamente:

```text
¿Qué tengo que hacer hoy?
```

y durante el día:

```text
¿Qué es lo siguiente?
```

y al finalizar:

```text
¿Qué hice hoy?
```

---

# 80. Regla de producto principal

Toda nueva funcionalidad debe evaluarse según esta pregunta:

> ¿Ayuda al usuario a organizar, priorizar, ejecutar o recordar mejor sus actividades?

Si la respuesta es no, no debe agregarse al núcleo de NEXO.
