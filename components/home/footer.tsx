import Link from "next/link"
import { Github, Linkedin, Twitter, Youtube } from "lucide-react"
import { FaGithub, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Column 1: Products */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Productos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Proteinas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Creatina
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Pre-Entrenamiento
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Vitamins
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Help
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Nutrition
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company - Only shown on medium and large screens */}
          <div className="hidden md:block">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Clients
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social - Only shown on medium and large screens */}
          <div className="hidden md:block">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Social</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://github.com/francozeta/vitaforge" className="flex items-center text-sm text-gray-600 hover:text-gray-900" target="_blank">
                  <FaGithub className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <FaLinkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <FaXTwitter className="mr-2 h-4 w-4" />
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <FaYoutube className="mr-2 h-4 w-4" />
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile version of Company and Social - Only shown on small screens */}
        <div className="mt-8 grid grid-cols-2 gap-8 md:hidden">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Social</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
