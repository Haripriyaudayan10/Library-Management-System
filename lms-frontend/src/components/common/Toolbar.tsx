import { Search, Filter } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface Props {
  chips: string[];
}

export default function Toolbar({ chips }: Props) {
  return (
    <Card className="mt-4 flex flex-wrap items-center gap-2 p-3">
      <label className="relative min-w-full flex-1 sm:min-w-64">
        <Search
          className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
          size={14}
        />

        <input
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs"
          placeholder="Search..."
        />
      </label>

      <Button variant="secondary" size="sm">
        <Filter size={14} />
      </Button>

      {chips.map((chip) => (
        <Button key={chip} size="sm" variant="secondary">
          {chip}
        </Button>
      ))}

      <Button variant="ghost" size="sm">
        ...
      </Button>
    </Card>
  );
}
