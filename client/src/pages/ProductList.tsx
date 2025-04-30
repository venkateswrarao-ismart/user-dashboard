
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

export default function ProductList() {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get('category');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/products${categoryId ? `?categoryId=${categoryId}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    }
  });

  const currentCategory = categories?.find(cat => cat.id === categoryId);
  const safeProducts = productsData || [];
  
  return (
    <div className="container py-8">
      <Helmet>
        <title>Products {currentCategory ? `- ${currentCategory.name}` : ''}</title>
      </Helmet>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[300px] bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {safeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && safeProducts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No products found</h2>
            <p className="text-gray-600 mb-8">
              {currentCategory
                ? `No products available in ${currentCategory.name}`
                : 'No products available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
