import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";

interface IInputBoxProps {
  name: string;
  label: string;
  type?: "text" | "number";
  value: string;
  error: boolean;
  helperText: string;
  handleChange: (event: any) => void;
  required?: boolean;
  disabled?: boolean;
  inputRef?: any;
}

export const InputBox: React.FC<IInputBoxProps> = ({
  inputRef,
  name,
  label,
  type,
  value,
  error,
  helperText,
  required,
  disabled,
  handleChange,
}) => {
  return (
    <TextField
      variant="outlined"
      fullWidth={true}
      sx={{ paddingBottom: 2 }}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
      inputRef={inputRef ?? undefined}
      name={name}
      // label={value == "" ? label : ""}
      label={label}
      type={type ?? "text"}
      value={value}
      error={error}
      helperText={helperText}
      required={required ?? false}
      disabled={disabled ?? false}
      onChange={handleChange}
    ></TextField>
  );
};
