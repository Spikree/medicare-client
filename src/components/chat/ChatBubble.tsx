import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  /** True when the message came from the other party, not the signed-in user. */
  incoming: boolean;
  text?: string;
  imageUrl?: string;
  createdAt?: string;
  /** Avatar shown for incoming messages. */
  authorImage?: string;
};

export function ChatBubble({
  incoming,
  text,
  imageUrl,
  createdAt,
  authorImage,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-end gap-2.5",
        !incoming && "flex-row-reverse"
      )}
    >
      <Avatar className="h-7 w-7 shrink-0">
        {incoming ? (
          <>
            <AvatarImage src={authorImage} alt="" />
            <AvatarFallback>
              <User className="h-3.5 w-3.5" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-3.5 w-3.5" />
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5",
          incoming
            ? "rounded-bl-sm border border-border bg-card"
            : "rounded-br-sm bg-primary text-primary-foreground"
        )}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Attachment"
            loading="lazy"
            className="mb-2 max-h-64 max-w-64 cursor-pointer rounded-lg transition-opacity hover:opacity-90"
            onClick={() => window.open(imageUrl, "_blank")}
          />
        )}

        {text && (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {text}
          </p>
        )}

        {createdAt && (
          <p
            className={cn(
              "tabular mt-1 text-[0.6875rem]",
              incoming ? "text-muted-foreground" : "text-primary-foreground/65"
            )}
          >
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatBubble;
