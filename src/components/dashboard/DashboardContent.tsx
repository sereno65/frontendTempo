import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
} from "lucide-react";

interface DashboardContentProps {
  metrics?: {
    totalProducts: number;
    totalSales: number;
    totalPurchases: number;
    revenue: number;
  };
  lowStockItems?: {
    id: string;
    name: string;
    currentStock: number;
    minStockLevel: number;
    category: string;
  }[];
  expiringItems?: {
    id: string;
    name: string;
    expiryDate: string;
    daysRemaining: number;
    quantity: number;
  }[];
}

const DashboardContent = ({
  metrics = {
    totalProducts: 245,
    totalSales: 182,
    totalPurchases: 56,
    revenue: 24680,
  },
  lowStockItems = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      currentStock: 15,
      minStockLevel: 50,
      category: "Pain Relief",
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      currentStock: 8,
      minStockLevel: 30,
      category: "Antibiotics",
    },
    {
      id: "3",
      name: "Cetirizine 10mg",
      currentStock: 5,
      minStockLevel: 25,
      category: "Allergy",
    },
    {
      id: "4",
      name: "Ibuprofen 400mg",
      currentStock: 12,
      minStockLevel: 40,
      category: "Pain Relief",
    },
  ],
  expiringItems = [
    {
      id: "1",
      name: "Vitamin C 1000mg",
      expiryDate: "2023-12-15",
      daysRemaining: 15,
      quantity: 45,
    },
    {
      id: "2",
      name: "Aspirin 75mg",
      expiryDate: "2023-12-20",
      daysRemaining: 20,
      quantity: 60,
    },
    {
      id: "3",
      name: "Diclofenac Gel",
      expiryDate: "2023-12-10",
      daysRemaining: 10,
      quantity: 12,
    },
    {
      id: "4",
      name: "Metformin 500mg",
      expiryDate: "2023-12-05",
      daysRemaining: 5,
      quantity: 30,
    },
  ],
}: DashboardContentProps) => {
  return (
    <div className="p-6 bg-background w-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">items in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              transactions this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Purchases
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">orders this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle>Low Stock Alert</CardTitle>
            </div>
            <CardDescription>
              Products that need to be restocked soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>
                          {item.currentStock}/{item.minStockLevel}
                        </span>
                        <Progress
                          value={(item.currentStock / item.minStockLevel) * 100}
                          className="h-2 w-20"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-200"
                      >
                        Low Stock
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Expiring Medications Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <CardTitle>Expiring Medications</CardTitle>
            </div>
            <CardDescription>Products expiring within 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {item.expiryDate}
                    </TableCell>
                    <TableCell>{item.quantity} units</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.daysRemaining <= 10
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }
                      >
                        {item.daysRemaining <= 10 ? "Critical" : "Warning"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest transactions and inventory changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-md border">
              <div className="bg-green-100 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Sale completed</p>
                <p className="text-sm text-muted-foreground">
                  Paracetamol 500mg x 2 boxes
                </p>
              </div>
              <div className="text-sm text-muted-foreground">Just now</div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-md border">
              <div className="bg-blue-100 p-2 rounded-full">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New stock received</p>
                <p className="text-sm text-muted-foreground">
                  Amoxicillin 250mg x 5 boxes
                </p>
              </div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-md border">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Low stock alert</p>
                <p className="text-sm text-muted-foreground">
                  Cetirizine 10mg below threshold
                </p>
              </div>
              <div className="text-sm text-muted-foreground">5 hours ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
