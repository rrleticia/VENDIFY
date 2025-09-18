import { Paper, Stack, Typography, Divider } from "@mui/material";
import type { ReactNode } from "react";

export default function ProfileSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2, width: 1 }}>
      <Stack direction="row" alignItems="center" gap={1}>
        {icon}
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
      </Stack>
      <Divider sx={{ my: 1.5 }} />
      {children}
    </Paper>
  );
}
