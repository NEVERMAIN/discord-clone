import { create } from "zustand";
import { Channel, ChannelType, Server } from "@prisma/client";


export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveSever" | "deleteServer"
                        | "deleteChannel" | "editChannel";

interface ModalData {
  server?:Server;
  channelType?: ChannelType;
  channel?: Channel;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType,data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type,data={}) => set({ isOpen: true, type,data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
