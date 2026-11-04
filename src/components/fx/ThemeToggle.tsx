export const THEME_KEY = "theme";
export type Theme = "light" | "dark";

// phone browser bar colour per theme (the page background)
const BAR = { light: "#faf9f4", dark: "#0b0c0e" } as const;

/** Runs in <head> before first paint, so a returning dark-mode visitor never sees a light flash. */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_KEY}")==="dark"){document.documentElement.classList.add("dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","${BAR.dark}")}}catch(e){}`;

export const isDark = () => document.documentElement.classList.contains("dark");

/** Switch the page theme and remember it (light is the default). */
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BAR[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode: the choice just isn't remembered */
  }
}
