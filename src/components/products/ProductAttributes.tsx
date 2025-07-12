import React, { useState, useEffect } from "react";
import { Search, Package, Calendar, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  stockLevel: number;
  price: number;
  costPrice: number;
  expirationDate: string;
  manufacturer: string;
  location: string;
  reorderLevel: number;
}

interface ProductAttributesProps {
  products?: Product[];
}

const ProductAttributes = ({
}: ProductAttributesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
  fetch("http://localhost:8000/produits/")
    .then((res) => res.json())
    .then((data) => {
      const mappedProducts = data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name || "",
        sku: item.sku || "N/A",
        category: item.category || "N/A",
        stockLevel: item.stock || 0,
        expirationDate: item.expirationDate || "2099-12-31",
        price: item.price || 0,
        costPrice: item.costPrice || 0,
        description: item.description || "",
        manufacturer: item.manufacturer || "N/A",
        location: item.location || "N/A",
        reorderLevel: item.reorderLevel || 0,
      }));
      setProducts(mappedProducts);
    })
    .catch((error) =>
      console.error("Erreur lors du chargement des produits :", error)
    );
  }, []);

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock <= reorderLevel)
      return { label: "Low", variant: "destructive" as const };
    if (stock <= reorderLevel * 2)
      return { label: "Medium", variant: "secondary" as const };
    return { label: "Good", variant: "default" as const };
  };

  const isExpiringSoon = (date: string) => {
    const expirationDate = new Date(date);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Product Attributes</h1>
        <p className="text-muted-foreground">
          Search and view detailed information about products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {searchTerm && (
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {product.sku}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {product.category}
                            </Badge>
                          </div>
                          <Badge
                            variant={
                              getStockStatus(
                                product.stockLevel,
                                product.reorderLevel,
                              ).variant
                            }
                          >
                            {product.stockLevel} units
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No products found matching your search.
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProduct ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedProduct.sku}
                    </p>
                  </div>
                  <Badge
                    variant={
                      getStockStatus(
                        selectedProduct.stockLevel,
                        selectedProduct.reorderLevel,
                      ).variant
                    }
                  >
                    {
                      getStockStatus(
                        selectedProduct.stockLevel,
                        selectedProduct.reorderLevel,
                      ).label
                    }{" "}
                    Stock
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Category</span>
                    </div>
                    <p className="text-sm">{selectedProduct.category}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="text-sm">
                      ${selectedProduct.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Cost Price</span>
                    </div>
                    <p className="text-sm">
                      ${selectedProduct.costPrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Stock Level</span>
                    </div>
                    <p className="text-sm">
                      {selectedProduct.stockLevel} units
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Reorder Level</span>
                    </div>
                    <p className="text-sm">
                      {selectedProduct.reorderLevel} units
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Expiration Date
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isExpiringSoon(selectedProduct.expirationDate)
                          ? "text-destructive font-medium"
                          : ""
                      }`}
                    >
                      {new Date(
                        selectedProduct.expirationDate,
                      ).toLocaleDateString()}
                      {isExpiringSoon(selectedProduct.expirationDate) &&
                        " (Expiring Soon)"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Manufacturer</span>
                    </div>
                    <p className="text-sm">
                      {selectedProduct.manufacturer || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-sm">
                      {selectedProduct.location || "N/A"}
                    </p>
                  </div>
                </div>

                {selectedProduct.description && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedProduct.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a product from the search results to view its details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductAttributes;
