import type { RutinaEjercicioDto } from "../../types/RutinaDto";
import SerieItem from "./SerieItem";

type Props = {
    rutinaEjercicio: RutinaEjercicioDto    
}



const EjercicioItem = ({rutinaEjercicio} : Props) => {
    return (        
        <article>

            <header>
                <h5>{rutinaEjercicio.ejercicio.nombre}</h5>                                
            </header>

            <section className="mt-4">
                {rutinaEjercicio.series?.map(s => (                    
                    <SerieItem key={s.rutinaSerieId} serie={s}/>
                    
                ))}
            </section>
        </article>
    );
}

export default EjercicioItem;