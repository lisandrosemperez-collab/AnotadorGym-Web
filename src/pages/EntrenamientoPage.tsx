import { useState } from "react";

const ejercicios = [
  {
    nombre: "Sentadilla",
    series: 3,
    repeticiones: "12 reps",
    descanso: "60s",
  },
  {
    nombre: "Press de banca",
    series: 4,
    repeticiones: "10 reps",
    descanso: "90s",
  },
  {
    nombre: "Remo con barra",
    series: 3,
    repeticiones: "12 reps",
    descanso: "60s",
  },
];

const EntrenamientoPage = () => {
  const [ejercicioActivo, setEjercicioActivo] = useState(0);

  const siguienteEjercicio = () => {
    setEjercicioActivo((prev) => (prev + 1) % ejercicios.length);
  };

  const ejercicio = ejercicios[ejercicioActivo];

  return (
    <div className="w-full max-w-6xl space-y-6">
      <header className="training-card rounded-2xl border p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="training-accent text-sm font-medium uppercase tracking-[0.2em]">
              Entrenamiento en curso
            </p>
            <h1 className="mt-2 text-3xl font-bold">Rutina de fuerza</h1>
            <p className="training-card-muted mt-2 max-w-2xl text-sm">
              Sigue cada bloque con foco, controla el descanso y marca cuando completes cada serie.
            </p>
          </div>
          <div className="training-chip rounded-xl px-4 py-3 text-sm font-semibold">
            Duración estimada: 35 min
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="training-card rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="training-card-muted text-sm font-medium">Ejercicio actual</p>
              <h2 className="mt-1 text-2xl font-semibold">{ejercicio.nombre}</h2>
            </div>
            <div className="training-chip rounded-full px-3 py-1 text-sm font-medium">
              {ejercicioActivo + 1}/{ejercicios.length}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl p-4 training-card">
              <p className="training-card-muted text-sm">Series</p>
              <p className="mt-1 text-xl font-semibold">{ejercicio.series}</p>
            </div>
            <div className="rounded-xl p-4 training-card">
              <p className="training-card-muted text-sm">Repeticiones</p>
              <p className="mt-1 text-xl font-semibold">{ejercicio.repeticiones}</p>
            </div>
            <div className="rounded-xl p-4 training-card">
              <p className="training-card-muted text-sm">Descanso</p>
              <p className="mt-1 text-xl font-semibold">{ejercicio.descanso}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="training-button-primary rounded-lg px-4 py-2 font-medium transition">
              Completar serie
            </button>
            <button
              onClick={siguienteEjercicio}
              className="training-button-secondary rounded-lg border px-4 py-2 font-medium transition"
            >
              Siguiente ejercicio
            </button>
          </div>
        </section>

        <aside className="training-card rounded-2xl border p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Resumen</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl p-4 training-card">
              <p className="training-card-muted text-sm">Progreso</p>
              <p className="mt-1 text-2xl font-semibold">2/3 ejercicios</p>
            </div>
            <div className="rounded-xl p-4 training-card">
              <p className="training-card-muted text-sm">Modo</p>
              <p className="mt-1 text-lg font-semibold">Fuerza + resistencia</p>
            </div>
          </div>
        </aside>
      </div>

      <section className="training-card rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Lista de ejercicios</h3>
        <div className="mt-4 space-y-3">
          {ejercicios.map((item, index) => (
            <div
              key={item.nombre}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                index === ejercicioActivo ? "training-item-active" : ""
              }`}
            >
              <div>
                <p className="font-medium">{item.nombre}</p>
                <p className="training-card-muted text-sm">
                  {item.series} series · {item.repeticiones} · descanso {item.descanso}
                </p>
              </div>
              <span className="training-card-muted text-sm font-medium">
                {index === ejercicioActivo ? "Actual" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EntrenamientoPage;
