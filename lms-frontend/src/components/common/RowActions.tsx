import { Eye, SquarePen, Trash2 } from "lucide-react";

export default function RowActions() {
  return (
    <div className="flex items-center gap-3 text-slate-400">
  <Eye size={16} className="cursor-pointer hover:text-slate-700" />
  <SquarePen size={16} className="cursor-pointer hover:text-slate-700" />
  <Trash2 size={16} className="cursor-pointer hover:text-rose-600" />
</div>
  );
}