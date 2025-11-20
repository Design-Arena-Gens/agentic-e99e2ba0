import "./globals.css";
export const metadata = {
  title: "An?lisis Pareto por fila - Google Sheets",
  description: "Analiza respuestas por fila y genera informe seg?n Pareto."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
