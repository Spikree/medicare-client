import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  name: string;
  email: string;
  /** Buttons rendered at the trailing edge. */
  actions: ReactNode;
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

/** A person in a search result or request list, with its available actions. */
export function PersonRow({ name, email, actions }: Props) {
  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>{initials(name || "?")}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">{actions}</div>
    </li>
  );
}

export default PersonRow;
