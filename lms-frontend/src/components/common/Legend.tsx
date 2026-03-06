interface Props {
  color: string;
  label: string;
}

export default function Legend({ color, label }: Props) {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}