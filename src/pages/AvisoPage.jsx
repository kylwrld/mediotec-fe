import Spinner from "@/components/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthContext from "@/context/AuthContext";
import { Users } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AvisoPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [announcement, setAnnouncement] = useState({});
    const { getRequest } = useContext(AuthContext);

    const fetchAnnouncement = async () => {
        const response = await getRequest(`announcement/${id}`);
        const data = await response.json();
        setAnnouncement(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAnnouncement();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="flex flex-col my-10 lg:mx-16 xl:mx-46 2xl:mx-72">
            <div className="flex flex-row items-center gap-3 bg-blue-600 p-4 rounded-t-lg">
                <Avatar>
                    <AvatarImage src={announcement.user.image} />
                    <AvatarFallback>
                        <img src="https://tiermaker.com/images/media/avatars-2024/jvilla699/jvilla699.jpg?1721389851" />
                    </AvatarFallback>
                </Avatar>
                <h1 className="text-xl lg:text-2xl text-white">{announcement.title}</h1>
            </div>
            <div className="flex flex-col border-x border-b rounded-b-lg border-slate-300">

                <p className="flex flex-row items-center gap-2 px-4 py-2 text-slate-500">
                    {announcement.user.name}
                    <div className="bg-slate-500 w-1 h-1 rounded-full"></div>
                    {new Date(announcement.created_at).toLocaleString("pt-BR")}</p>
                {/* body */}
                <div className="p-4">
                    <h2 className="text-lg lg:text-lg xl:text-xl font-normal whitespace-pre-wrap">{announcement.body}</h2>
                </div>

                <div className="border-b border-slate-300" />

                <div className="p-4">
                    <div className="flex gap-2">
                        <Users color="black" />
                        {announcement.comments.length > 1 ? (
                            <p>{announcement.comments.length} comentários da turma</p>
                        ) : announcement.comments.length > 0 ? (
                            <p>{announcement.comments.length} comentário da turma</p>
                        ) : (
                            <p>Comentários da turma</p>
                        )}
                    </div>
                </div>
                    {announcement.comments.length > 0 && (
                        <div className="border-b border-slate-300" />
                    )}
                {/* <div className="border-b border-slate-300"></div> */}
                {/* Comentários */}
                <div className="rounded-b-lg">
                    {announcement.comments.length > 0
                        ? announcement.comments.map((commentObj, index) => (
                            <>
                                <div key={commentObj.id} className={`flex flex-col p-4 gap-2 transition-colors hover:bg-muted/50`}>
                                    <div className="flex flex-row items-center gap-3">
                                        <div className="flex gap-2 items-center">
                                            <Avatar>
                                                <AvatarImage src={commentObj.user.image} />
                                                <AvatarFallback>
                                                    <img src="https://tiermaker.com/images/media/avatars-2024/jvilla699/jvilla699.jpg?1721389851" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="font-inter-semibold">{commentObj.user.name}</p>
                                        </div>
                                        <p className="font-inter-regular text-slate-500">
                                            {new Date(commentObj.created_at).toLocaleString("pt-BR")}
                                        </p>
                                    </div>
                                    <p className="font-inter-regular ">{commentObj.body}</p>
                                </div>
                                {announcement.comments.length > 0 && index != announcement.comments.length - 1 && (
                                    <div className="h-[1px] bg-slate-300"></div>
                                )}
                            </>
                        ))
                        : null}
                </div>
            </div>
        </div>
    );
}

export default AvisoPage;
