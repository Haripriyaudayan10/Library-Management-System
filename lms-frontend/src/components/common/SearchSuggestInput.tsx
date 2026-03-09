import { Search } from 'lucide-react';

export interface SearchSuggestionItem {
  id: string;
  label: string;
  value: string;
}

interface SearchSuggestInputProps {
  value: string;
  placeholder: string;
  suggestions: SearchSuggestionItem[];
  onChange: (value: string) => void;
  onSelect: (item: SearchSuggestionItem) => void;
  onEnter?: () => void;
  className?: string;
}

export default function SearchSuggestInput({
  value,
  placeholder,
  suggestions,
  onChange,
  onSelect,
  onEnter,
  className = '',
}: SearchSuggestInputProps) {
  return (
    <div className={`relative ${className}`.trim()}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
      <input
        className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onEnter?.();
          }
        }}
      />

      {value.trim() && suggestions.length > 0 ? (
        <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow">
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-50"
              onClick={() => onSelect(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
