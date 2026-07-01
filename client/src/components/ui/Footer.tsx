import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 px-6 py-4 w-full flex justify-between items-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} AES By Aadikshar Bhandari </p>
            <div className="flex items-center gap-5">
                <a
                    href="#"
                    aria-label="Facebook"
                    className="hover:text-gray-600 transition-colors"
                >
                    <FaFacebook />
                </a>
                <a
                    href="#"
                    aria-label="GitHub"
                    className="hover:text-gray-600 transition-colors"
                >
                    <FaGithub />
                </a>
                <a
                    href="#"
                    aria-label="LinkedIn"
                    className="hover:text-gray-600 transition-colors"
                >
                    <FaLinkedin />
                </a>
            </div>
        </footer>
    );
}
