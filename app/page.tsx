"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProductGrid from "./components/ProductGrid"
import CategoryMenu from "./components/CategoryMenu"
import FilterBar from "./components/FilterBar"

interface Product {
  codigo: number
  nombre: string
  observ: string
  precio: number
  image: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("http://172.19.0.3:8000/articulos/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error))
  }, [])

  return (   
      <div className="flex flex-col min-h-screen">
        <Header />
        <FilterBar />
        <main className="flex-grow flex flex-col md:flex-row bg-current">
          <CategoryMenu />
          <ProductGrid products={products} />
        </main>
        <Footer />
      </div>
  )
}

