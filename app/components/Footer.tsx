"use client";
import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"
import { use } from "react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex justify-center space-x-6">
        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
          <Facebook className="w-6 h-6" />
        </Link>
        <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
          <Twitter className="w-6 h-6" />
        </Link>
        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
          <Instagram className="w-6 h-6" />
        </Link>
      </div>
    </footer>
  )
}

