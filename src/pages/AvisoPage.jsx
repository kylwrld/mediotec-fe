import Spinner from "@/components/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AuthContext from "@/context/AuthContext";
import { SendHorizontal, Users } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AvisoPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [announcement, setAnnouncement] = useState({});
    const [error, setError] = useState("")
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);

    const { getRequest, postRequest } = useContext(AuthContext);

    const fetchAnnouncement = async () => {
        const response = await getRequest(`announcement/${id}`);
        const data = await response.json();
        if (!response.ok) {
            setError(data.detail)
            setLoading(false)
        } else {
            setAnnouncement(data);
            setLoading(false);
        }
    };

    async function sendComment() {
        // setSubmittingComment(true)
        if (comment.trim() == "") return;
        setSending(true)
        const data = { body: comment, announcement: id };
        const response = await postRequest("comment/", data);
        const commentData = (await response.json()).comment;
        setAnnouncement({ ...announcement, comments: [...announcement.comments, commentData] });
        setComment("")
        setSending(false)
        // setSubmittingComment(false)
    }


    useEffect(() => {
        fetchAnnouncement();
    }, []);

    if (loading) return <Spinner />;
    if (error) return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col justify-start text-left gap-3">
                <h1 className="text-4xl text-blue-600 font-bold">{error}</h1>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col my-10 lg:mx-16 xl:mx-46 2xl:mx-72">
            <div className="flex flex-row items-center gap-3 bg-blue-600 p-4 rounded-t-lg">
                <Avatar>
                    <AvatarImage src={announcement.user.image} />
                    <AvatarFallback>
                        <img src="https://tiermaker.com/images/media/avatars-2024/jvilla699/jvilla699.jpg?1721389851" />
                    </AvatarFallback>
                </Avatar>
                <h1 className="text-lg lg:text-xl text-white">{announcement.title}</h1>
            </div>
            <div className="flex flex-col border-x  border-slate-300">

                <div className="flex flex-row items-center gap-2 px-4 py-2 text-slate-500">
                    {announcement.user.name}
                    <div className="bg-slate-500 w-1 h-1 rounded-full"></div>
                    {new Date(announcement.created_at).toLocaleString("pt-BR")}</div>
                {/* body */}
                <div className="p-4">
                    <h2 className=" font-normal whitespace-pre-wrap">{announcement.body}</h2>
                </div>

                <div className="border-b border-slate-300" />

                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <Users color="black" />
                        {announcement.comments.length > 1 ? (
                            <p className="text-sm">{announcement.comments.length} comentários da turma</p>
                        ) : announcement.comments.length > 0 ? (
                            <p className="text-sm">{announcement.comments.length} comentário da turma</p>
                        ) : (
                            <p className="text-sm">Comentários da turma</p>
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
                                            <p className="font-inter-semibold text-sm">{commentObj.user.name}</p>
                                        </div>
                                        <p className="font-inter-regular text-slate-500 text-sm">
                                            {new Date(commentObj.created_at).toLocaleString("pt-BR")}
                                        </p>
                                    </div>
                                    <p className="font-inter-regular text-sm">{commentObj.body}</p>
                                </div>
                                {announcement.comments.length > 0 && index != announcement.comments.length - 1 && (
                                    <div className="h-[1px] bg-slate-300"></div>
                                )}
                            </>
                        ))
                        : null}
                </div>
            </div>
            <div className="border-b border-slate-300" />
            <div className="flex flex-row border-x border-b rounded-b-lg border-slate-300">
                {/* <Textarea className="border-0 focus:rounded-tr-none focus:rounded-tl-none" placeholder="Envie um comentário" onChange={(value) => setComment(value)}></Textarea> */}
                <textarea className="border-0 focus:rounded-t-none flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Envie um comentário" onChange={(e) => setComment(e.target.value)} />
                <div>
                    <Button className="h-full rounded-l-none rounded-tr-none bg-orange-600 hover:bg-orange-600" onClick={sendComment}><SendHorizontal /></Button>
                </div>
            </div>
        </div>
    );
}

export default AvisoPage;
