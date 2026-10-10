# Contrato de API para Estadísticas

El backend ASP.NET Core no está incluido en este workspace. La página consume estos contratos bajo el prefijo que ya configura `VITE_API_URL` (actualmente termina en `/api`). Todas las rutas deben requerir JWT y obtener el usuario exclusivamente desde el claim autenticado; no aceptar `usuarioId` desde query o body.

Los parámetros `desde` y `hasta` son fechas ISO `yyyy-MM-dd`, inclusivas. El servidor debe aplicar ambos límites con una única zona/calendario coherente con `Entrenamiento.Fecha`; no convertir una fecha calendario mediante UTC/local de forma implícita. La zona de negocio debe alinearse con la convención existente del backend.

## Endpoints

- `GET /Estadisticas/Resumen?desde=...&hasta=...` devuelve `ResumenEstadisticasDto`.
- `GET /Estadisticas/Frecuencia?desde=...&hasta=...` devuelve `PuntoFrecuenciaDto[]`; agrupa por semana o mes según amplitud y `periodo` identifica el inicio del bucket.
- `GET /Estadisticas/Duracion?desde=...&hasta=...` devuelve `PuntoDuracionDto[]`; suma la duración de entrenamientos completados por bucket diario, semanal o mensual.
- `GET /Estadisticas/Volumen?desde=...&hasta=...` devuelve `PuntoVolumenDto[]`; suma el volumen válido por bucket.
- `GET /Estadisticas/ProgresoEjercicio/{ejercicioId}?desde=...&hasta=...` devuelve `ProgresoEjercicioDto`, con sesiones del período y mejor marca histórica del ejercicio. Esta respuesta alimenta tanto gráfico como historial para evitar un endpoint redundante.

Las propiedades JSON usan camelCase:

```json
{
  "entrenamientosCompletados": 0,
  "tiempoTotalSegundos": 0,
  "duracionPromedioSegundos": null,
  "frecuenciaSemanal": null,
  "volumenTotal": null
}
```

```json
[
  { "periodo": "2026-10-05", "entrenamientos": 2 }
]
```

Los puntos de duración usan `{ "periodo": "2026-10-05", "duracionSegundos": 3600 }`; los de volumen usan `{ "periodo": "2026-10-05", "volumen": 2400 }`.

Cada sesión de ejercicio usa `entrenamientoId`, `fecha` (`yyyy-MM-dd`), `pesoMaximo`, `repeticionesEnPesoMaximo`, `repeticionesMaximas`, `cantidadSeriesValidas`, `volumen`, `rmEstimado` y `mejorMarca`. La respuesta de progreso añade `mejorMarcaHistorica` (`pesoMaximo`, `repeticiones`, `fecha`, `rmEstimado`) o `null`.

## Reglas de cálculo y seguridad

- Resumen, frecuencia, duración y volumen generales incluyen solo entrenamientos persistidos y completados del usuario del claim autenticado.
- Progreso incluye solo series persistidas y marcadas como completadas, con repeticiones mayores que cero; no consulta ni suma `SerieReferencia`/series planificadas. No contar dos veces una misma entidad.
- Volumen suma `peso * repeticiones` solo para peso externo positivo y repeticiones válidas. Si no hay peso externo suficiente, responder `null` en el resumen o cero/ausencia de puntos de volumen según el contrato de respuesta, nunca fabricar una carga corporal.
- Repeticiones pueden incluir series ejecutadas sin carga externa; `pesoMaximo` y el 1RM no deben tratar cero como progreso de carga.
- Epley se calcula solo para peso externo mayor que cero y de 1 a 15 repeticiones: `peso * (1 + repeticiones / 30)`. El servidor debe excluir datos fuera del rango.
- La mejor marca es de todo el historial del usuario para ese ejercicio, independiente del rango solicitado; la lista `sesiones` sí respeta el rango.
- Una sesión se identifica por entrenamiento persistido y fecha; para el peso representativo se conserva el mayor peso válido y sus repeticiones asociadas. El volumen suma todas las series válidas de esa sesión.
- Las consultas deben filtrar por el usuario autenticado en SQL/EF Core antes de agregar, sin modificar datos históricos.
