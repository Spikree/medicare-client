import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Send, X } from "lucide-react";

type Props = {
  text: string;
  onTextChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  onRemoveImage: () => void;
  hasAttachment: boolean;
};

/** Message composer: attachment preview, text field, image picker, send. */
export function ChatComposer({
  text,
  onTextChange,
  onSend,
  onKeyDown,
  fileInputRef,
  onImageSelect,
  imagePreview,
  onRemoveImage,
  hasAttachment,
}: Props) {
  return (
    <div className="shrink-0 border-t border-border p-4">
      <div className="mx-auto max-w-3xl">
        {imagePreview && (
          <div className="relative mb-3 inline-block">
            <img
              src={imagePreview}
              alt="Selected attachment"
              className="max-h-32 max-w-32 rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              aria-label="Remove attachment"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message…"
            className="flex-1"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageSelect}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            size="icon"
            variant="outline"
            aria-label="Attach an image"
          >
            <ImagePlus />
          </Button>

          <Button
            onClick={onSend}
            disabled={!text.trim() && !hasAttachment}
            size="icon"
            aria-label="Send message"
          >
            <Send />
          </Button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for a new line.
        </p>
      </div>
    </div>
  );
}

export default ChatComposer;
