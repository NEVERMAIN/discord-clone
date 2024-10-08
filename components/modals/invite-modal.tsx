"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


export const InviteModal = () => {

  const {onOpen,isOpen,onClose,type,data}  = useModal();
  /** 获取当前的 ip+port */
  const origin =  useOrigin();
  /** 满足打开页面开关并且属于是 invite 事件,则显示 invite-modal */
  const isModalOpen = isOpen && type === "invite";
  const {server} = data;

  const [copied,setCopied] = useState(false);
  const [isLoading,setIsLoading] = useState(false)

  /**
   * http://localhost:3000/invite/9fe37ce3-ac26-46a9-b94e-b643bde53b79
   */
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = ()=>{
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(()=>{
      setCopied(false);
    },1000)
  }

  const onNew = async ()=>{
    try{
      setIsLoading(true);
      const resposne = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      //  修改全局存储的值,驱动 invite-modal 刷新页面 
      onOpen("invite",{server: resposne.data})

    }catch(error){
     console.log(error);
    }finally{
      setIsLoading(false);
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            ivnite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
          >
          Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
            disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied 
                ? <Check className="w-4 h-4"/> 
                : <Copy className="w-4 h-4"/> 
              }
              
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading} 
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCcw className="w-4 h-4 ml-2"/>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
