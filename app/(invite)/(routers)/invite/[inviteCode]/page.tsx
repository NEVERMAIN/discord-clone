import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { serialize } from "v8";

interface InviteCodePageProps {
    params: {
        inviteCode : string;
    };
}


const InviteCodePage = async ({
    params,
}:InviteCodePageProps) => {

    const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn();
    }

    if(!params.inviteCode){
        return redirect("/");
    }

    /**
     * 判断是否已经存在该 server 中
     */
    const exsitingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    /**
     * 如果已经存在server,重定向到该页面
     */
    if(exsitingServer){
        return redirect(`/servers/${exsitingServer.id}`);
    }

    /**
     * 不存在则加入该 server
     */
    const server = await db.server.update({
        where:{
            inviteCode: params.inviteCode,
        },
        data: {
            members:{
                create:[
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    })

    /**
     * 修改后重定向到该 server
     */
    if(server){
        return redirect(`/servers/${server.id}`);
    }
    
    return null;
}
 
export default InviteCodePage;