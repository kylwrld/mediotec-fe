import { useParams } from "react-router-dom";

function EstudantePage({ data }) {
    const { id } = useParams();

    return (
        <div className="h-full">
            <div className="flex flex-col justify-start text-left gap-3">
                <h1 className="text-4xl text-blue-600 font-bold">Estudante {id}</h1>
                <h2 className="text-muted-foreground ml-[1.5px]">Estudante</h2>
            </div>
        </div>
    );
}

export default EstudantePage;
