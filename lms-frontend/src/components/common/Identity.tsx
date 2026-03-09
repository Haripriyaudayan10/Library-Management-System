interface Props {
  name: string;
  subtitle: string;
  imageUrl?: string;
}

export default function Identity({ name, subtitle, imageUrl }: Props) {
  return (
    <div className="flex items-center gap-2">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-7 w-7 rounded-full object-cover" />
      ) : (
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
      )}
      <div>
        <p className="text-xs font-semibold text-slate-800">{name}</p>
        <p className="text-[10px] uppercase text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
