import type { RutinaSeriesDto } from "../../types/RutinaDto";

type Props = {
    serie: RutinaSeriesDto
}

const SerieItem = ({serie} : Props) => {
    return (
    <div className="flex flex-row items-center gap-3 mb-2">   
        <strong>Serie {serie.numeroSerie}</strong>
        <div>🔁 {serie.repeticiones} reps</div>
        <div>💤 {serie.descanso}</div>
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