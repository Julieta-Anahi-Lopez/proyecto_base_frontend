// app/home/HeroCarousel.tsx
"use client";
import React from "react";
import Carousel from "../components/Carousel";

const carouselSlides = [
  {
    image: "/images/slides/1200px x 900 px  - IMAGEN CARROUSEL 7.jpg",
    alt: "Productos de limpieza Klinner",
    title: "Representante Oficial Walker",
    description: "Productos de alta calidad para el cuidado y limpieza de tu vehículo"
  },
  {
    image: "/images/slides/1200px x 900 px  - IMAGEN CARROUSEL 10.jpg",
    alt: "Distribución oficial Walker",
    title: "Representante Oficial Walker",
    description: "Repuestos originales y accesorios para tu vehículo"
  },
  {
    image: "/images/slides/1200px x 900 px  - IMAGEN CARROUSEL 8.jpg",
    alt: "Servicio de mantenimiento",
    title: "Representante Oficial Walker",
    description: "Contamos con personal capacitado para brindarte el mejor servicio"
  }
];

export default function HeroCarousel() {
  return (
    <section className="w-full max-w-screen-2xl mx-auto px-4 py-6">
      <Carousel slides={carouselSlides} autoPlayInterval={6000} />
    </section>
  );
}