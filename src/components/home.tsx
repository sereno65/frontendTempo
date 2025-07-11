import React, { useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  BarChart2,
  Settings,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  CalendarIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    products: true,
    sales: false,
    purchases: false,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
      // Here you would typically fetch new data based on the selected date
      // For now, we'll just update the state
    }
  };

  // Generate date-based metrics (mock data that changes based on selected date)
  const getMetricsForDate = (date: Date) => {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const baseMultiplier = (dayOfYear % 30) + 1;

    return {
      totalProducts: 1200 + baseMultiplier * 2,
      lowStockItems: 20 + (baseMultiplier % 15),
      expiringSoon: 10 + (baseMultiplier % 8),
      todaysSales: 1500 + baseMultiplier * 15,
    };
  };

  const currentMetrics = getMetricsForDate(selectedDate);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold">MediStock</h1>
          ) : (
            <span className="text-xl font-bold mx-auto">MS</span>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${isSidebarOpen ? "px-3" : "px-0 justify-center"}`}
            >
              <Home size={20} />
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </Button>

            {/* Products Section */}
            <div>
              <Button
                variant="ghost"
                className={`w-full justify-start ${isSidebarOpen ? "px-3" : "px-0 justify-center"}`}
                onClick={() => isSidebarOpen && toggleSection("products")}
              >
                <Package size={20} />
                {isSidebarOpen && (
                  <>
                    <span className="ml-3 flex-1 text-left">Products</span>
                    {expandedSections.products ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </>
                )}
              </Button>
              {isSidebarOpen && expandedSections.products && (
                <div className="ml-6 mt-1 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    All Products
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Categories
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Expiring Soon
                  </Button>
                </div>
              )}
            </div>

            {/* Sales Section */}
            <div>
              <Button
                variant="ghost"
                className={`w-full justify-start ${isSidebarOpen ? "px-3" : "px-0 justify-center"}`}
                onClick={() => isSidebarOpen && toggleSection("sales")}
              >
                <ShoppingCart size={20} />
                {isSidebarOpen && (
                  <>
                    <span className="ml-3 flex-1 text-left">Sales</span>
                    {expandedSections.sales ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </>
                )}
              </Button>
              {isSidebarOpen && expandedSections.sales && (
                <div className="ml-6 mt-1 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    New Sale
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Sales History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Reports
                  </Button>
                </div>
              )}
            </div>

            {/* Purchases Section */}
            <div>
              <Button
                variant="ghost"
                className={`w-full justify-start ${isSidebarOpen ? "px-3" : "px-0 justify-center"}`}
                onClick={() => isSidebarOpen && toggleSection("purchases")}
              >
                <BarChart2 size={20} />
                {isSidebarOpen && (
                  <>
                    <span className="ml-3 flex-1 text-left">Purchases</span>
                    {expandedSections.purchases ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </>
                )}
              </Button>
              {isSidebarOpen && expandedSections.purchases && (
                <div className="ml-6 mt-1 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    New Purchase
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Purchase History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Suppliers
                  </Button>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start ${isSidebarOpen ? "px-3" : "px-0 justify-center"}`}
            >
              <Settings size={20} />
              {isSidebarOpen && <span className="ml-3">Settings</span>}
            </Button>
          </nav>
        </div>

        {isSidebarOpen && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=pharmacy" />
                <AvatarFallback>PH</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Pharmacy Admin</p>
                <p className="text-xs text-muted-foreground">
                  admin@medistock.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="mr-2">
                      {selectedDate.toDateString() === new Date().toDateString()
                        ? "Today"
                        : format(selectedDate, "MMM dd, yyyy")}
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentMetrics.totalProducts.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">
                  {currentMetrics.lowStockItems}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires attention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {currentMetrics.expiringSoon}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Within 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {selectedDate.toDateString() === new Date().toDateString()
                    ? "Today's"
                    : "Selected Day"}{" "}
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${currentMetrics.todaysSales.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedDate.toDateString() === new Date().toDateString()
                    ? "+5% from yesterday"
                    : format(selectedDate, "MMM dd, yyyy")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Products that need to be restocked soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <Package size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Paracetamol 500mg</p>
                          <p className="text-sm text-muted-foreground">
                            SKU: MED-{1000 + item}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="mb-1 bg-amber-500/10 text-amber-500 border-amber-500/20"
                        >
                          Low Stock
                        </Badge>
                        <p className="text-sm">
                          <span className="font-bold">{item * 5}</span> / 100
                          units
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Low Stock Items
                </Button>
              </CardContent>
            </Card>

            {/* Expiring Medications */}
            <Card>
              <CardHeader>
                <CardTitle>Expiring Medications</CardTitle>
                <CardDescription>
                  Products expiring within 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <Package size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Amoxicillin 250mg</p>
                          <p className="text-sm text-muted-foreground">
                            SKU: MED-{2000 + item}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="mb-1 bg-red-500/10 text-red-500 border-red-500/20"
                        >
                          Expires in {item * 5} days
                        </Badge>
                        <p className="text-sm">
                          <span className="font-bold">{item * 20}</span> units
                          in stock
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Expiring Items
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest inventory changes and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4">
                    <ShoppingCart size={20} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Sale completed</p>
                    <p className="text-sm text-muted-foreground">
                      12 items sold for $245.80
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
                <Separator />
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                    <Package size={20} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Inventory updated</p>
                    <p className="text-sm text-muted-foreground">
                      Added 200 units of Ibuprofen 200mg
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">1 hour ago</p>
                </div>
                <Separator />
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-4">
                    <BarChart2 size={20} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Purchase order created</p>
                    <p className="text-sm text-muted-foreground">
                      PO-2023-0458 for $1,245.00
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">3 hours ago</p>
                </div>
                <Separator />
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mr-4">
                    <Package size={20} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Low stock alert</p>
                    <p className="text-sm text-muted-foreground">
                      Paracetamol 500mg below threshold
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
