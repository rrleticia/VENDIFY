import { useRef } from "react";
import { Button } from "@mui/material";

export default function ImageUploader({
  onSelect,
}: {
  onSelect: (urls: string[]) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <input
        type="file"
        ref={ref}
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          // mock: create blob object URLs
          const urls = files.map((f) => URL.createObjectURL(f));
          onSelect(urls);
        }}
      />
      <Button variant="outlined" onClick={() => ref.current?.click()}>
        Selecionar imagens
      </Button>
    </>
  );
}
