import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  name?: string;
  profilePicture?: string;
  /** Shown under the name, e.g. the person's role. */
  subtitle?: string;
};

export function ChatHeader({ name, profilePicture, subtitle }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={profilePicture} alt="" />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name ?? "—"}</p>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
