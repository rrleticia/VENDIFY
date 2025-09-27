import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Grid } from "@mui/system";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { ordersMock } from "@common/mocks";

const getEbooksComprados = () => {
  const ebooks = ordersMock
    .filter(order => order.status === "PAID" || order.status === "AVAILABLE")
    .flatMap(order => 
      order.items.filter(item => item.isDigital).map(item => ({
        ...item,
        orderId: order.id,
        purchaseDate: order.createdAt,
        status: order.status,
      }))
    );
  return ebooks;
};

export default function EbooksPage() {
  const ebooks = getEbooksComprados();

  const handleDownload = (downloadUrl: string) => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <MenuBookRoundedIcon fontSize="large" />
        <Typography variant="h4" fontWeight={800}>
          Meus E-books
        </Typography>
      </Stack>

      {ebooks.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <MenuBookRoundedIcon sx={{ fontSize: 64, color: "text.secondary" }} />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Nenhum e-book encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Você ainda não comprou nenhum e-book. Explore nosso catálogo!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => window.location.href = "/catalog?category=cat-ebooks"}
          >
            Ver E-books
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {ebooks.map((ebook) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${ebook.orderId}-${ebook.id}`}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={ebook.image}
                  alt={ebook.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Stack gap={1}>
                    <Typography variant="h6" fontWeight={700} noWrap>
                      {ebook.name}
                    </Typography>
                    
                    <Stack direction="row" gap={1}>
                      <Chip
                        icon={<MenuBookRoundedIcon fontSize="small" />}
                        label="E-book"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {ebook.fileFormat && (
                        <Chip
                          label={ebook.fileFormat}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      Comprado em {new Date(ebook.purchaseDate).toLocaleDateString('pt-BR')}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<DownloadRoundedIcon />}
                      onClick={() => handleDownload(ebook.downloadUrl || '')}
                      disabled={!ebook.downloadUrl}
                      sx={{ mt: 1 }}
                    >
                      Download
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}