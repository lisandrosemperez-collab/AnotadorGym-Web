import type { RutinaEjercicioDto } from "../../types/RutinaDto";
import SerieItem from "./SerieItem";

type Props = {
    rutinaEjercicio: RutinaEjercicioDto    
}



const EjercicioItem = ({rutinaEjercicio} : Props) => {
    return (        
        <article className="mx-auto w-full max-w-2xl text-center">

            <header className="flex justify-center text-center">
                <h5 className="break-words">{rutinaEjercicio.ejercicio.nombre}</h5>
            </header>

            <section className="mx-auto mt-4 flex w-full flex-col items-center gap-2">
                {rutinaEjercicio.series?.map(s => (                    
                    <SerieItem key={s.rutinaSerieId} serie={s}/>
                    
                ))}
            </section>
        </article>
    );
}

export default EjercicioItem;