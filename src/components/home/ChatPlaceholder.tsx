import { Lock } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const ChatPlaceHolder = () => {
  return (
    <div className="w-3/4 bg-gray-secondary flex flex-col items-center justify-center py-10">
      <div className="flex flex-col items-center w-full justify-center py-10 gap-4">
        <p className="text-3xl font-extralight mt-5 mb-2">
          No Conversations yet
        </p>
        <p className="w-1/2 text-center text-gray-primary text-sm text-muted-foreground">
          Select a Conversation to start chatting
        </p>
      </div>
      <p className="w-1/2 mt-auto text-center text-gray-primary text-xs text-muted-foreground flex items-center justify-center gap-1">
        <Lock size={10} /> Your personal messages are end-to-end encrypted
      </p>
    </div>
  );
};
export default ChatPlaceHolder;
