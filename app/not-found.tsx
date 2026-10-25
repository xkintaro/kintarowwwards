import { inter, syne } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { NotFoundContent } from "@/components/sections/not-found-content";
import enDict from "@/dictionaries/en.json";

export const metadata = {
  title: "404 - Page Not Found",
  description: "Page not found.",
};

export default function RootNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>404 - Page Not Found</title>
      </head>
      <body className={`${inter.variable} ${syne.variable} font-sans bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <CustomCursor />
          <NotFoundContent dict={enDict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
