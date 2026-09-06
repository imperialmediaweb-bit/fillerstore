import { themeCss } from "@/lib/theme";

// Injectează paleta paginii ca variabile CSS, direct în HTML-ul randat pe
// server. Fiind scrisă după globals.css, are prioritate — și, spre deosebire
// de setarea din JavaScript, culorile sunt corecte din primul cadru.
export default function ThemeStyle({ seed }) {
  return <style>{themeCss(seed)}</style>;
}
