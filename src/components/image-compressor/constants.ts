import { OutputFormat } from "./types";

export const FORMAT_OPTIONS: {
  value: OutputFormat;
  label: string;
  ext: string;
}[] = [
  {
    value: "image/jpeg",
    label: "JPEG",
    ext: "jpg",
  },
  {
    value: "image/webp",
    label: "WebP",
    ext: "webp",
  },
  {
    value: "image/png",
    label: "PNG",
    ext: "png",
  },
  {
    value: "application/pdf",
    label: "PDF",
    ext: "pdf",
  },
];