import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { } from "next/navigation";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { channel } from "diagnostics_channel";


export async function PATCH(
    req:Request,
    {params}: {params: {channelId : string}}

) {
    try{
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");
        const {name,type} = await req.json();

        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!params.channelId){
            return new NextResponse("Channel ID Missing",{status:400});
        }
        if(!serverId){
            return new NextResponse("Server ID Missing",{status:400});
        }
        if(name === "general"){
            return new NextResponse("Channel name cannot be 'general",{status:400});
        }

       const server = await db.server.update({
            where:{
                id: serverId,
                members:{
                    some:{
                        profileId : profile.id,
                        role:{
                            in: [MemberRole.ADMIN,MemberRole.MODERATOR],
                        }
                    }
                },
            },
            data:{
                channels:{
                    update:{
                        where:{
                            id: params.channelId,
                            NOT:{
                                name: 'general'
                            }
                        },
                        data:{
                            name,
                            type,
                        }
                    }
                }
            }
       });

       return NextResponse.json(server);

    }catch(error){
        console.log("[DELETE_CHANNEL_ID]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}


export async function DELETE(
    req: Request,
    {params}:{params: {channelId: string}}
) {
    try{

        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!params.channelId){
            return new NextResponse("Channel ID Missing",{status:400});
        }
        if(!serverId){
            return new NextResponse("Server ID Missing",{status:400});
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                members:{
                    some:{
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN,MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data:{
                channels:{
                    delete:{
                        id: params.channelId,
                        name: {
                            not: "general",
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);


    }catch(error){
        console.log("CHANNEL_[CHANNEL_ID_DELETE]",error);
        return new NextResponse("Intenerl Error",{status:500});
    }
}