// app/components/ServiceFeatures.tsx
"use client";

import { Truck, CreditCard, ShoppingBag } from "lucide-react";
import React from "react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-white/90 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function ServiceFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Feature
        icon={<Truck size={36} />}
        title="Envíos"
        description="A todo el país."
      />
      <Feature
        icon={<CreditCard size={36} />}
        title="Formas de Pago"
        description="Efectivo, transferencia, tarjeta, cheques."
      />
      <Feature
        icon={<ShoppingBag size={36} />}
        title="Mínimo de Compra"
        description="Monto mínimo de compra para todo el país $50.000"
      />
    </div>
  );
}