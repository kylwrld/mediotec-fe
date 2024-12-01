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
        <div className="flex flex-col gap-5 mt-10 mx-96">
            <h1 className="text-2xl md:text-3xl">{announcement.title}</h1>
            <h2 className="text-xl md:text-xl font-normal">{announcement.body}</h2>
            <div className="flex gap-2">
                <Users color="black" />
                {announcement.comments.length > 0 ? (
                    <p>{announcement.comments.length} comentário da turma</p>
                ) : announcement.comments.length > 1 ? (
                    <p>{announcement.comments.length} comentários da turma</p>
                ) : (
                    <p>Comentários da turma</p>
                )}
            </div>
            <div className="mb-10">
                {announcement.comments.length > 0
                    ? announcement.comments.map((commentObj, index) => (
                        <>
                            <div key={commentObj.id} className={`flex flex-col py-4 gap-2 rounded-lg`}>
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
                                    <p className="font-inter-regular text-gray-500">
                                        {new Date(commentObj.created_at).toLocaleString("pt-BR")}
                                    </p>
                                </div>
                                <p className="font-inter-regular ">{commentObj.body}</p>
                            </div>
                            {index != announcement.comments.length-1 && <div className="border-b border-gray-300"></div>}
                        </>
                      ))
                    : null}
            </div>
        </div>
    );
}

export default AvisoPage;
