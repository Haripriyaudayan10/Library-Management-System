interface Props {
  label: string;
  value: string;
  danger?: boolean;
}

export default function DateBox({ label, value, danger }: Props) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${danger ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`text-sm font-semibold ${danger ? 'text-rose-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}
