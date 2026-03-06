import { Eye, SquarePen, Trash2 } from "lucide-react";

export default function RowActions() {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <Eye size={14} />
      <SquarePen size={14} />
      <Trash2 size={14} />
    </div>
  );
}