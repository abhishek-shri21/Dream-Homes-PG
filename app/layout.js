import "./globals.css";
import Chatbot from "../components/Chatbot";

export const metadata = {
  title: "Dream Homes PG | Comfortable PG Accommodation in Jodhpur",
  description:
    "Find the best PG accommodation in Jodhpur. Dream Homes PG offers safe, affordable, and fully furnished rooms for boys, girls, and co-living with amenities like WiFi, AC, meals, and 24/7 security.",
  keywords: "PG in Jodhpur, boys PG Jodhpur, girls PG Jodhpur, co-living Jodhpur, paying guest Jodhpur",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-gray-800 bg-[#f8f9fa] antialiased">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}

