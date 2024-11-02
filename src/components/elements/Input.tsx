import { Button, InputAdornment, TextField } from "@mui/material";

import { toast } from "react-toastify";

type Props = {
  label: string;
  value: string;
  onChange?: (newValue: string) => void;
  type?: string;
  currency?: string;
  readOnly?: boolean;
  helperText?: string;
  error?: boolean;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
};

function Input({
  label,
  value,
  onChange,
  type,
  currency,
  readOnly,
  helperText,
  error,
  color,
}: Props) {
  return (
    <TextField
      variant="outlined"
      color={color}
      focused={!!color}
      label={label}
      value={value}
      helperText={helperText}
      error={error}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={label}
      InputProps={{
        startAdornment: currency && (
          <InputAdornment position="start">{currency}</InputAdornment>
        ),
        endAdornment: readOnly && (
          <InputAdornment position="end">
            <Button
              className="hidden-button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(value);
                  toast.success("Copied to clipboard");
                }
              }}
            >
              Copy
            </Button>
          </InputAdornment>
        ),
        readOnly: readOnly,
        // disableUnderline: readOnly,
      }}
      type={type || "text"}
    />
  );
}

export default Input;
