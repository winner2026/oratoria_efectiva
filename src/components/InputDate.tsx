interface InputDateProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}

export function InputDate({ label, value, onChange, min }: InputDateProps) {
  return (
    <label
      style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}
    >
      {label}
      <input
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.currentTarget.value)}
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #d9d9d9",
        }}
      />
    </label>
  );
}
