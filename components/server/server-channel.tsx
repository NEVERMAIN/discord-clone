"use client";

import { cn } from "@/lib/utils";
import { Channel, Server, MemberRole, ChannelType } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();

  const { onOpen } = useModal();

  const Icon = iconMap[channel.type];

  const onClick = ()=> {
    router.push(`/servers/${params.serverId}/channels/${channel.id}`);
  }
  
  /**
   * 处理模态框操作
   * 
   * @param {React.MouseEvent} e - 鼠标事件对象，用于拦截事件冒泡
   * @param {ModalType} action - 模态框操作类型，决定执行哪种操作
   */
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    // 阻止事件冒泡，防止触发父元素的不必要响应
    e.stopPropagation();
    // 根据操作类型执行对应操作，并传递服务器和频道信息
    onOpen(action, { server, channel });
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e)=> onAction(e,"editChannel")}
              className="hidden group-hover:block w-4 h-4
                         text-zinc-500 hover:text-zinc-600 dark:text-zinc-400
                         dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e,"deleteChannel")}
              className="hidden group-hover:block w-4 h-4
                         text-zinc-500 hover:text-zinc-600 dark:text-zinc-400
                         dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </div>
  );
};
