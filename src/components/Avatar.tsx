import raw from "@/assets/avatar-cartoon.svg?raw";

/* The header avatar, inlined so its backdrop can follow the accent colour (an <img> can't read
   CSS variables). The yellow gradient becomes the accent plus a soft sheen; ids are prefixed. */
const svg = raw
  .replace(/id="c"/, 'id="av-c"')
  .replace(/url\(#c\)/g, "url(#av-c)")
  .replace(/id="lens"/, 'id="av-lens"')
  .replace(/url\(#lens\)/g, "url(#av-lens)")
  .replace(
    /<linearGradient id="bg"[^]*?<\/linearGradient>/,
    '<linearGradient id="av-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>',
  )
  .replace(
    '<rect width="200" height="200" fill="url(#bg)"/>',
    '<rect width="200" height="200" fill="var(--secondary)"/><rect width="200" height="200" fill="url(#av-sheen)"/>',
  )
  .replace(/role="img" aria-label="[^"]*" /, 'aria-hidden="true" width="100%" height="100%" ');

export function Avatar({ className = "" }: { className?: string }) {
  return <span className={`block ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
