import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    {params}: {params : {serverId:string}}
) {
  try {
    const profile = await currentProfile();

    const { imageUrl, name } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name: name,
        imageUrl: imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * 删除 server
 * @param req 请求参数
 * @param params 路径参数 serverId 
 * @returns 
 */
export async function DELETE(
  req:Request,
  {params} : {params : {serverId : string}}
) {
  try{

      const profile = await currentProfile();
      const serverId = params?.serverId;

      if(!profile){
          return new NextResponse("Unauthorized",{status:401});
      }

      if(!serverId){
          return new NextResponse("Server ID Missing",{status:400});
      }

      const server = await db.server.delete({
          where:{
              id: serverId,
              profileId: profile?.id,
          }
      })

      return NextResponse.json(server);

  }catch(error){
      console.log("[SERVERS_SERVERID_DELETE]",error);
      return new NextResponse("Internal Error",{status:500});
  }
  
}