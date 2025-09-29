import "./globals.css";

export const metadata = {
    title: "Museu Literário",
    description: "Projeto pra mostrar tudo que eu sei",
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
