import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Plus, Trash2, Search } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const purchaseItemSchema = z.object({
  productId: z.string().min(1, { message: "Please select a product." }),
  productName: z.string().min(1, { message: "Product name is required." }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1." }),
  unitCost: z.coerce
    .number()
    .min(0.01, { message: "Unit cost must be greater than 0." }),
  discount: z.coerce
    .number()
    .min(0, { message: "Discount cannot be negative." })
    .max(100, { message: "Discount cannot exceed 100%." })
    .default(0),
  total: z.coerce.number(),
  notes: z.string().optional(),
});

const formSchema = z.object({
  purchaseOrderNumber: z
    .string()
    .min(1, { message: "Purchase order number is required." }),
  supplierName: z.string().min(1, { message: "Supplier name is required." }),
  supplierContact: z.string().optional(),
  supplierEmail: z.string().email().optional().or(z.literal("")),
  orderDate: z.date({
    required_error: "Order date is required.",
  }),
  expectedDeliveryDate: z.date().optional(),
  items: z
    .array(purchaseItemSchema)
    .min(1, { message: "At least one item is required." }),
  subtotal: z.coerce.number(),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  taxAmount: z.coerce.number(),
  shippingCost: z.coerce.number().min(0).default(0),
  totalAmount: z.coerce.number(),
  notes: z.string().optional(),
  status: z.string().min(1, { message: "Please select a status." }),
  priority: z.string().min(1, { message: "Please select a priority." }),
});

type PurchaseOrderFormValues = z.infer<typeof formSchema>;

interface PurchaseOrderFormProps {
  initialData?: Partial<PurchaseOrderFormValues>;
  onSubmit?: (data: PurchaseOrderFormValues) => void;
  isEditing?: boolean;
}

// Mock product data
const mockProducts = [
  { id: "1", name: "Paracetamol 500mg", cost: 3.5, currentStock: 50 },
  { id: "2", name: "Amoxicillin 250mg", cost: 8.75, currentStock: 25 },
  { id: "3", name: "Ibuprofen 400mg", cost: 5.25, currentStock: 30 },
  { id: "4", name: "Cetirizine 10mg", cost: 4.5, currentStock: 15 },
  { id: "5", name: "Vitamin C 1000mg", cost: 12.99, currentStock: 40 },
];

const PurchaseOrderForm = ({
  initialData,
  onSubmit,
  isEditing = false,
}: PurchaseOrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const defaultValues: Partial<PurchaseOrderFormValues> = {
    purchaseOrderNumber: "",
    supplierName: "",
    supplierContact: "",
    supplierEmail: "",
    orderDate: new Date(),
    expectedDeliveryDate: undefined,
    items: [
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitCost: 0,
        discount: 0,
        total: 0,
        notes: "",
      },
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    shippingCost: 0,
    totalAmount: 0,
    notes: "",
    status: "draft",
    priority: "medium",
    ...initialData,
  };

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const watchedTaxRate = form.watch("taxRate");
  const watchedShippingCost = form.watch("shippingCost");

  // Calculate totals whenever items, tax rate, or shipping cost changes
  React.useEffect(() => {
    const subtotal = watchedItems.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.unitCost || 0);
      const discountAmount = (itemTotal * (item.discount || 0)) / 100;
      return sum + (itemTotal - discountAmount);
    }, 0);

    const taxAmount = (subtotal * (watchedTaxRate || 0)) / 100;
    const totalAmount = subtotal + taxAmount + (watchedShippingCost || 0);

    form.setValue("subtotal", subtotal);
    form.setValue("taxAmount", taxAmount);
    form.setValue("totalAmount", totalAmount);

    // Update individual item totals
    watchedItems.forEach((item, index) => {
      const itemTotal = (item.quantity || 0) * (item.unitCost || 0);
      const discountAmount = (itemTotal * (item.discount || 0)) / 100;
      form.setValue(`items.${index}.total`, itemTotal - discountAmount);
    });
  }, [watchedItems, watchedTaxRate, watchedShippingCost, form]);

  const handleSubmit = async (data: PurchaseOrderFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      console.log("Purchase order data:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    append({
      productId: "",
      productName: "",
      quantity: 1,
      unitCost: 0,
      discount: 0,
      total: 0,
      notes: "",
    });
  };

  const selectProduct = (index: number, product: (typeof mockProducts)[0]) => {
    form.setValue(`items.${index}.productId`, product.id);
    form.setValue(`items.${index}.productName`, product.name);
    form.setValue(`items.${index}.unitCost`, product.cost);
    setProductSearch("");
  };

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <Card className="w-full max-w-5xl bg-white">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Purchase Order" : "New Purchase Order"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Purchase Order Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="purchaseOrderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Order Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PO number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Order Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={"w-full pl-3 text-left font-normal"}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedDeliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expected Delivery Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={"w-full pl-3 text-left font-normal"}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Supplier Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supplier Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="supplierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Discount %</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="w-[250px]">
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.productName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Search products..."
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setProductSearch(e.target.value);
                                        }}
                                      />
                                      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {productSearch && filteredProducts.length > 0 && (
                              <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {filteredProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                    onClick={() =>
                                      selectProduct(index, product)
                                    }
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {product.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Cost: ${product.cost.toFixed(2)}
                                      </div>
                                    </div>
                                    <Badge variant="outline">
                                      Stock: {product.currentStock}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    className="w-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitCost`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-24"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.discount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${(watchedItems[index]?.total || 0).toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.notes`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Notes"
                                    className="w-32"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">
                            Pending Approval
                          </SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="sent">Sent to Supplier</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Totals</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Cost</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label>Subtotal</Label>
                  <div className="text-2xl font-bold">
                    ${form.watch("subtotal").toFixed(2)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tax Amount</Label>
                  <div className="text-2xl font-bold">
                    ${form.watch("taxAmount").toFixed(2)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <div className="text-3xl font-bold text-primary">
                    ${form.watch("totalAmount").toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes or special instructions"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6 flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <div className="space-x-2">
                <Button variant="outline" type="button">
                  Save as Draft
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                      ? "Update Purchase Order"
                      : "Create Purchase Order"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderForm;
