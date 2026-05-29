import { FaInstagram, FaFacebook, FaDiscord, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-nav-bluegray font-electro text-white mt-10 p-6">
    
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    
    <p className="text-sm md:text-base">
    © {new Date().getFullYear()} Reactor - Tutti i diritti riservati
    </p>
    
    <div className="flex gap-6 text-2xl text-gray-400">
    
    <a href="#" className="hover:text-pink-500 transition">
    <FaInstagram />
    </a>
    
    <a href="#" className="hover:text-blue-500 transition">
    <FaFacebook />
    </a>
    
    <a href="#" className="hover:text-indigo-500 transition">
    <FaDiscord />
    </a>
    
    <a href="#" className="hover:text-white transition">
    <FaXTwitter />
    </a>
    
    </div>
    </div>
    </footer>
  );
}