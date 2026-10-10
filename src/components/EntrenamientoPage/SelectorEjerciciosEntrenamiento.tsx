import { useEffect, useState } from "react";
import type { EjercicioDTO } from "../../types/EjercicioDto";
import type { EjercicioEntrenadoDTO } from "../../types/EntrenamientoDto";

interface SelectorEjerciciosEntrenamientoProps {
    ejercicios: EjercicioDTO[];
    ejerciciosExistentes: number[];
    loading: boolean;
    error: string | null;
    onAgregar: (ejercicios: EjercicioEntrenadoDTO[]) => void;
    onCerrar: () => void;
}

const SelectorEjerciciosEntrenamiento = ({
    ejercicios,
    ejerciciosExistentes,
    loading,
    error,
    onAgregar,
    onCerrar
}: SelectorEjerciciosEntrenamientoProps) => {
    const [busqueda, setBusqueda] = useState("");
    const [seleccionados, setSeleccionados] = useState<Set<number>>(
        () => new Set()
    );

    useEffect(() => {
        const manejarTecla = (event: KeyboardEvent) => {
            if (event.key === "Escape") onCerrar();
        };

        window.addEventListener("keydown", manejarTecla);
        return () => window.removeEventListener("keydown", manejarTecla);
    }, [onCerrar]);

    const terminos = busqueda.trim().toLocaleLowerCase();
    const ejerciciosFiltrados = ejercicios.filter(ejercicio => {
        const campos = [
            ejercicio.nombre,
            ejercicio.descripcion,
            ejercicio.grupoMuscular?.nombre,
            ejercicio.musculoPrimario?.nombre,
            ...(ejercicio.musculosSecundarios?.map(musculo => musculo.nombre) ?? [])
        ];

        return campos.some(campo => campo?.toLocaleLowerCase().includes(terminos));
    });

    const alternarSeleccion = (ejercicioId: number) => {
        setSeleccionados(prev => {
            const siguiente = new Set(prev);
            if (siguiente.has(ejercicioId)) {
                siguiente.delete(ejercicioId);
            } else {
                siguiente.add(ejercicioId);
            }
            return siguiente;
        });
    };

    const confirmarSeleccion = () => {
        const ejerciciosEntrenados = ejercicios
            .filter(ejercicio =>
                ejercicio.ejercicioId !== null &&
                seleccionados.has(ejercicio.ejercicioId) &&
                !ejerciciosExistentes.includes(ejercicio.ejercicioId)
            )
            .map((ejercicio): EjercicioEntrenadoDTO => ({
                ejercicioEntrenadoId: null,
                ejercicioId: ejercicio.ejercicioId!,
                Ejercicio: ejercicio,
                orden: 0,
                notas: null,
                completado: false,
                series: []
            }));

        onAgregar(ejerciciosEntrenados);
    };

    return (
        <div className="training-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
            <section
                aria-labelledby="selector-ejercicios-titulo"
                aria-modal="true"
                className="training-card flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border shadow-xl"
                role="dialog"
            >
                <header className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] p-4">
                    <h2 id="selector-ejercicios-titulo" className="text-xl font-semibold">
                        Agregar ejercicios
                    </h2>
                    <button
                        type="button"
                        className="training-button-secondary border px-3 py-1"
                        onClick={onCerrar}
                    >
                        Cerrar
                    </button>
                </header>

                <div className="p-4">
                    <input
                        autoFocus
                        aria-label="Buscar ejercicios"
                        type="search"
                        placeholder="Buscar por nombre, músculo o grupo..."
                        value={busqueda}
                        onChange={event => setBusqueda(event.target.value)}
                    />
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
                    {loading && <p className="training-card-muted">Cargando ejercicios...</p>}
                    {!loading && error && <p className="training-card-muted">{error}</p>}
                    {!loading && !error && ejerciciosFiltrados.length === 0 && (
                        <p className="training-card-muted">No se encontraron ejercicios.</p>
                    )}

                    {!loading && !error && ejerciciosFiltrados.map(ejercicio => {
                        const id = ejercicio.ejercicioId;
                        const yaAgregado = id !== null && ejerciciosExistentes.includes(id);
                        const checked = yaAgregado || (id !== null && seleccionados.has(id));

                        return (
                            <label
                                key={id ?? ejercicio.nombre}
                                className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--color-border)] p-3 hover:bg-[var(--color-background)]"
                            >
                                <input
                                    className="training-checkbox mt-1"
                                    type="checkbox"
                                    checked={checked}
                                    disabled={id === null || yaAgregado}
                                    onChange={() => id !== null && alternarSeleccion(id)}
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-base font-medium text-[var(--color-text-primary)]">
                                        {ejercicio.nombre}
                                    </span>
                                    {ejercicio.grupoMuscular?.nombre && (
                                        <span className="training-card-muted block text-sm">
                                            {ejercicio.grupoMuscular.nombre}
                                        </span>
                                    )}
                                    {ejercicio.descripcion && (
                                        <span className="training-card-muted mt-1 block text-sm">
                                            {ejercicio.descripcion}
                                        </span>
                                    )}
                                </span>
                                {yaAgregado && (
                                    <span className="training-card-muted text-sm">Agregado</span>
                                )}
                            </label>
                        );
                    })}
                </div>

                <footer className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] p-4">
                    <span className="training-card-muted text-sm">
                        {seleccionados.size} seleccionados
                    </span>
                    <button
                        type="button"
                        className="training-button-primary px-4 py-2"
                        disabled={seleccionados.size === 0 || loading || Boolean(error)}
                        onClick={confirmarSeleccion}
                    >
                        Agregar seleccionados
                    </button>
                </footer>
            </section>
        </div>
    );
};

export default SelectorEjerciciosEntrenamiento;