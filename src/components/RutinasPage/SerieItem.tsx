import type { RutinaSeriesDto } from "../../types/RutinaDto";

type Props = {
    serie: RutinaSeriesDto
}

const formatearDescanso = (segundos: number) => {
    const totalSegundos = Math.max(0, Math.floor(segundos));
    const minutos = Math.floor(totalSegundos / 60);
    const segundosRestantes = totalSegundos % 60;

    if (minutos > 0 && segundosRestantes > 0) {
        return `${minutos} min ${segundosRestantes} s`;
    }

    if (minutos > 0) {
        return `${minutos} min`;
    }

    return `${segundosRestantes} s`;
};

const SerieItem = ({serie} : Props) => {
    return (
    <div className="mx-auto mb-2 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
        <strong>Serie {serie.numeroSerie}</strong>
        <div>🔁 {serie.repeticiones} reps</div>
        <div>💤 {formatearDescanso(serie.descanso)}</div>
        <div>⚡ {serie.porcentaje1RM}%</div>
        <div>📊 {tipoSerieTexto[serie.tipo]}</div>
    </div>
    );
}

const tipoSerieTexto : Record<number, string> = {
    0: "Normal",
    1: "DropSet",
    2: "Cluster",
    3: "Myo Reps",
    4: "Negativas",
    5: "Max RM"
}

export default SerieItem;