
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md" />
          <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
