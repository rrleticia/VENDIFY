import { Paper, Box, Typography } from "@mui/material";

interface IHomeStatBadgeProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function HomeStatBadge({
  icon,
  title,
  subtitle,
}: IHomeStatBadgeProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "action.hover",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography fontWeight={700}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
}
