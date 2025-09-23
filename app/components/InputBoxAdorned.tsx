import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface IInputBoxAdornedProps {
  name: string;
  label: string;
  value: string;
  error: boolean;
  helperText: string;
  required?: boolean;
  disabled?: boolean;
  inputRef?: any;
  handleChange: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
}

export const InputBoxAdorned: React.FC<IInputBoxAdornedProps> = ({
  inputRef,
  name,
  label,
  value,
  error,
  helperText,
  required,
  disabled,
  handleChange,
  onFocus,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      fullWidth={true}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="small"
              >
                {showPassword ? (
                  <Visibility sx={{ fontSize: 20 }} />
                ) : (
                  <VisibilityOff sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      inputRef={inputRef ?? undefined}
      name={name}
      // label={value == "" ? label : ""}
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      error={error}
      helperText={helperText}
      required={required ?? false}
      disabled={disabled ?? false}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
    ></TextField>
  );
};
