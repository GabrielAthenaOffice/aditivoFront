// src/screens/components/MaskedController.tsx
import { Controller, Control } from 'react-hook-form';

type Props = {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  mask: (v: string) => string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
};

export default function MaskedController({
  control, name, label, placeholder, mask, inputMode = 'numeric'
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          {label && <label className="text-xs text-ink-500">{label}</label>}
          <input
            className="input w-full"
            inputMode={inputMode}
            placeholder={placeholder}
            value={mask(field.value ?? '')}
            onChange={(e) => field.onChange(mask(e.target.value))}
            onBlur={field.onBlur}
            // cola: mantém só dígitos e re-aplica máscara
            onPaste={(e) => {
              e.preventDefault();
              const text = (e.clipboardData || (window as any).clipboardData).getData('text');
              field.onChange(mask(text));
            }}
          />
          {fieldState.error && (
            <p className="text-red-600 text-xs mt-1">{String(fieldState.error.message || '')}</p>
          )}
        </div>
      )}
    />
  );
}
