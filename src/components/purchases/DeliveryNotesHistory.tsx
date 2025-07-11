import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  FileText,
  Calendar,
  Package,
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

interface DeliveryNote {
  id: string;
  deliveryNoteNumber: string;
  supplierName: string;
  deliveryDate: string;
  purchaseOrderNumber?: string;
  totalAmount: number;
  status: "pending" | "partial" | "complete" | "cancelled";
  itemsCount: number;
  receivedBy: string;
}

interface DeliveryNotesHistoryProps {
  deliveryNotes?: DeliveryNote[];
  onAddDeliveryNote?: () => void;
  onEditDeliveryNote?: (deliveryNote: DeliveryNote) => void;
  onDeleteDeliveryNote?: (deliveryNoteId: string) => void;
  onViewDeliveryNote?: (deliveryNote: DeliveryNote) => void;
}

const DeliveryNotesHistory = ({
  deliveryNotes = defaultDeliveryNotes,
  onAddDeliveryNote = () => {},
  onEditDeliveryNote = () => {},
  onDeleteDeliveryNote = () => {},
  onViewDeliveryNote = () => {},
}: DeliveryNotesHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof DeliveryNote | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof DeliveryNote) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredDeliveryNotes = deliveryNotes.filter(
    (note) =>
      note.deliveryNoteNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      note.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.purchaseOrderNumber &&
        note.purchaseOrderNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  const sortedDeliveryNotes = [...filteredDeliveryNotes].sort((a, b) => {
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

  const getStatusBadge = (status: DeliveryNote["status"]) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      partial: { label: "Partial", variant: "outline" as const },
      complete: { label: "Complete", variant: "default" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };
    return statusConfig[status];
  };

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="text-2xl font-bold">Delivery Notes History</div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search delivery notes..."
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
                  All Delivery Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("complete")}>
                  Complete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchTerm("partial")}>
                  Partial
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={onAddDeliveryNote} className="gap-2">
              <Plus className="h-4 w-4" />
              New Delivery Note
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort("deliveryNoteNumber")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Delivery Note #
                    {sortField === "deliveryNoteNumber" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("supplierName")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Supplier
                    {sortField === "supplierName" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("deliveryDate")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Delivery Date
                    {sortField === "deliveryDate" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Items</TableHead>
                <TableHead
                  onClick={() => handleSort("totalAmount")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Total Amount
                    {sortField === "totalAmount" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("status")}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === "status" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Received By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDeliveryNotes.length > 0 ? (
                sortedDeliveryNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {note.deliveryNoteNumber}
                      </div>
                    </TableCell>
                    <TableCell>{note.supplierName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(note.deliveryDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{note.purchaseOrderNumber || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {note.itemsCount} items
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${note.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(note.status).variant}>
                        {getStatusBadge(note.status).label}
                      </Badge>
                    </TableCell>
                    <TableCell>{note.receivedBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDeliveryNote(note)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditDeliveryNote(note)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteDeliveryNote(note.id)}
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
                    colSpan={9}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No delivery notes found. Try adjusting your search or add a
                    new delivery note.
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

const defaultDeliveryNotes: DeliveryNote[] = [
  {
    id: "1",
    deliveryNoteNumber: "DN-2024-001",
    supplierName: "MedSupply Co.",
    deliveryDate: "2024-01-15",
    purchaseOrderNumber: "PO-2024-001",
    totalAmount: 1250.75,
    status: "complete",
    itemsCount: 5,
    receivedBy: "John Smith",
  },
  {
    id: "2",
    deliveryNoteNumber: "DN-2024-002",
    supplierName: "PharmaCorp Ltd.",
    deliveryDate: "2024-01-18",
    purchaseOrderNumber: "PO-2024-002",
    totalAmount: 890.5,
    status: "partial",
    itemsCount: 3,
    receivedBy: "Sarah Johnson",
  },
  {
    id: "3",
    deliveryNoteNumber: "DN-2024-003",
    supplierName: "HealthCare Supplies",
    deliveryDate: "2024-01-20",
    purchaseOrderNumber: "PO-2024-003",
    totalAmount: 2150.25,
    status: "complete",
    itemsCount: 8,
    receivedBy: "Mike Davis",
  },
  {
    id: "4",
    deliveryNoteNumber: "DN-2024-004",
    supplierName: "Global Pharma",
    deliveryDate: "2024-01-22",
    totalAmount: 675.0,
    status: "pending",
    itemsCount: 2,
    receivedBy: "Lisa Wilson",
  },
  {
    id: "5",
    deliveryNoteNumber: "DN-2024-005",
    supplierName: "MedSupply Co.",
    deliveryDate: "2024-01-25",
    purchaseOrderNumber: "PO-2024-005",
    totalAmount: 1450.8,
    status: "cancelled",
    itemsCount: 6,
    receivedBy: "Tom Brown",
  },
];

export default DeliveryNotesHistory;
