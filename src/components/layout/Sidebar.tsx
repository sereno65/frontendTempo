import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart2,
  Settings,
  Users,
  Menu,
  X,
  Pill,
  Stethoscope,
  Thermometer,
  Syringe,
  Clipboard,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  children?: NavItemProps[];
  isActive?: boolean;
}

const Sidebar = ({ className }: { className?: string }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>("dashboard");

  const navItems: NavItemProps[] = [
    {
      icon: <BarChart2 size={20} />,
      label: "Dashboard",
      to: "/",
      isActive: activeItem === "dashboard",
    },
    {
      icon: <Package size={20} />,
      label: "Products",
      children: [
        {
          icon: <Pill size={18} />,
          label: "Medications",
          to: "/products/medications",
        },
        {
          icon: <Stethoscope size={18} />,
          label: "Medical Supplies",
          to: "/products/supplies",
        },
        {
          icon: <Thermometer size={18} />,
          label: "Equipment",
          to: "/products/equipment",
        },
        {
          icon: <Syringe size={18} />,
          label: "Vaccines",
          to: "/products/vaccines",
        },
      ],
    },
    {
      icon: <ShoppingCart size={20} />,
      label: "Sales",
      children: [
        {
          icon: <Clipboard size={18} />,
          label: "New Sale",
          to: "/sales/new",
        },
        {
          icon: <TrendingUp size={18} />,
          label: "Sales History",
          to: "/sales/history",
        },
        {
          icon: <Calendar size={18} />,
          label: "Daily Sales",
          to: "/sales/daily",
        },
        {
          icon: <DollarSign size={18} />,
          label: "Returns",
          to: "/sales/returns",
        },
      ],
    },
    {
      icon: <Truck size={20} />,
      label: "Purchases",
      children: [
        {
          icon: <FileText size={18} />,
          label: "New Purchase",
          to: "/purchases/new",
        },
        {
          icon: <Clipboard size={18} />,
          label: "Purchase Orders",
          to: "/purchases/orders",
        },
        {
          icon: <TrendingUp size={18} />,
          label: "Purchase History",
          to: "/purchases/history",
        },
        {
          icon: <Users size={18} />,
          label: "Suppliers",
          to: "/purchases/suppliers",
        },
      ],
    },
    {
      icon: <CreditCard size={20} />,
      label: "Finance",
      to: "/finance",
    },
    {
      icon: <Users size={20} />,
      label: "Staff",
      to: "/staff",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      to: "/settings",
    },
  ];

  const handleItemClick = (label: string) => {
    setActiveItem(label.toLowerCase());
  };

  const NavItem = ({ icon, label, to, children, isActive }: NavItemProps) => {
    const [open, setOpen] = useState(false);
    const hasChildren = children && children.length > 0;

    if (hasChildren) {
      return (
        <Collapsible open={open} onOpenChange={setOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between px-3 py-2 h-auto text-left",
                open && "bg-accent",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{icon}</span>
                {!collapsed && <span>{label}</span>}
              </div>
              {!collapsed && (
                <span className="text-muted-foreground">
                  {open ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6">
            {!collapsed &&
              children.map((child, index) => (
                <NavItem
                  key={index}
                  {...child}
                  isActive={activeItem === child.label.toLowerCase()}
                />
              ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        variant="ghost"
        asChild
        className={cn(
          "w-full justify-start px-3 py-2 h-auto",
          isActive && "bg-accent",
        )}
        onClick={() => handleItemClick(label)}
      >
        <Link to={to || "#"} className="flex items-center gap-3">
          <span className="text-muted-foreground">{icon}</span>
          {!collapsed && <span>{label}</span>}
        </Link>
      </Button>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <div className="font-semibold text-lg">PharmTrack</div>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">Inventory v1.0</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
