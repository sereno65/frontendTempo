import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  expirationDate: string;
  price: number;
}

interface ProductsTableProps {
  products?: Product[];
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onViewProduct?: (product: Product) => void;
}

const ProductsTable = ({
  products = defaultProducts,
  onAddProduct = () => {},
  onEditProduct = () => {},
  onDeleteProduct = () => {},
  onViewProduct = () => {},
}: ProductsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return { label: "Low", variant: "destructive" as const };
    if (stock <= 15) return { label: "Medium", variant: "secondary" as const };
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
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="text-2xl font-bold">Products Inventory</div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchTerm("")}>
                  All Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("tablet")}>
                  Tablets
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("syrup")}>
                  Syrups
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("capsule")}>
                  Capsules
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={onAddProduct} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort("name")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Product Name
                    {sortField === "name" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("sku")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    SKU
                    {sortField === "sku" && <ArrowUpDown className="h-4 w-4" />}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("category")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortField === "category" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("stock")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Stock
                    {sortField === "stock" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("expirationDate")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Expiration Date
                    {sortField === "expirationDate" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("price")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortField === "price" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge variant={getStockStatus(product.stock).variant}>
                        {product.stock} - {getStockStatus(product.stock).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          isExpiringSoon(product.expirationDate)
                            ? "text-destructive font-medium"
                            : ""
                        }
                      >
                        {new Date(product.expirationDate).toLocaleDateString()}
                        {isExpiringSoon(product.expirationDate) &&
                          " (Expiring Soon)"}
                      </span>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewProduct(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No products found. Try adjusting your search or add a new
                    product.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    sku: "MED-PAR-500",
    category: "Pain Relief Tablets",
    stock: 120,
    expirationDate: "2025-06-15",
    price: 5.99,
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    sku: "MED-AMO-250",
    category: "Antibiotic Capsules",
    stock: 45,
    expirationDate: "2024-09-20",
    price: 12.5,
  },
  {
    id: "3",
    name: "Ibuprofen 200mg",
    sku: "MED-IBU-200",
    category: "Pain Relief Tablets",
    stock: 85,
    expirationDate: "2025-03-10",
    price: 6.75,
  },
  {
    id: "4",
    name: "Cetirizine 10mg",
    sku: "MED-CET-010",
    category: "Allergy Tablets",
    stock: 32,
    expirationDate: "2024-11-05",
    price: 8.25,
  },
  {
    id: "5",
    name: "Cough Syrup 100ml",
    sku: "MED-COU-100",
    category: "Cough Syrup",
    stock: 18,
    expirationDate: "2024-07-30",
    price: 9.99,
  },
  {
    id: "6",
    name: "Vitamin C 1000mg",
    sku: "VIT-C-1000",
    category: "Vitamin Tablets",
    stock: 60,
    expirationDate: "2026-01-15",
    price: 14.5,
  },
  {
    id: "7",
    name: "Aspirin 75mg",
    sku: "MED-ASP-075",
    category: "Pain Relief Tablets",
    stock: 95,
    expirationDate: "2025-08-22",
    price: 4.99,
  },
  {
    id: "8",
    name: "Children's Paracetamol Syrup",
    sku: "MED-CPS-100",
    category: "Children's Medicine",
    stock: 12,
    expirationDate: "2024-05-18",
    price: 7.5,
  },
  {
    id: "9",
    name: "Omeprazole 20mg",
    sku: "MED-OME-020",
    category: "Digestive Health",
    stock: 5,
    expirationDate: "2025-02-28",
    price: 11.25,
  },
  {
    id: "10",
    name: "Multivitamin Complex",
    sku: "VIT-MUL-001",
    category: "Vitamin Tablets",
    stock: 40,
    expirationDate: "2025-12-10",
    price: 16.99,
  },
];

export default ProductsTable;
