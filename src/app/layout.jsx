import "./globals.css";

export const metadata = {
    title: "Museu Literário",
    description: "Projeto de valorização da literatura brasileira.",
    icons: {
        icon: "/icons/favicon.ico",
    },
};

export default function RootLayout({ children }) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
