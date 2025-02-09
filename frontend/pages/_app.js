import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/authContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
           <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-grow">
                    <Sidebar />
                    <main className="flex-grow"> {/* Adjust padding and margin for the fixed sidebar */}
                        <Component {...pageProps} />
                    </main>
                </div>
            </div>
            <Footer />
  </AuthProvider>

);
}
