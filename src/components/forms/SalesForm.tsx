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

const saleItemSchema = z.object({
  productId: z.string().min(1, { message: "Please select a product." }),
  productName: z.string().min(1, { message: "Product name is required." }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1." }),
  unitPrice: z.coerce
    .number()
    .min(0.01, { message: "Unit price must be greater than 0." }),
  discount: z.coerce
    .number()
    .min(0, { message: "Discount cannot be negative." })
    .max(100, { message: "Discount cannot exceed 100%." })
    .default(0),
  total: z.coerce.number(),
});

const formSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  saleDate: z.date({
    required_error: "Sale date is required.",
  }),
  paymentMethod: z
    .string()
    .min(1, { message: "Please select a payment method." }),
  items: z
    .array(saleItemSchema)
    .min(1, { message: "At least one item is required." }),
  subtotal: z.coerce.number(),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  taxAmount: z.coerce.number(),
  totalAmount: z.coerce.number(),
  notes: z.string().optional(),
  prescriptionNumber: z.string().optional(),
});

type SalesFormValues = z.infer<typeof formSchema>;

interface SalesFormProps {
  initialData?: Partial<SalesFormValues>;
  onSubmit?: (data: SalesFormValues) => void;
  isEditing?: boolean;
}

// Mock product data - in a real app, this would come from your database
const mockProducts = [
  { id: "1", name: "Paracetamol 500mg", price: 5.99, stock: 150 },
  { id: "2", name: "Amoxicillin 250mg", price: 12.5, stock: 80 },
  { id: "3", name: "Ibuprofen 400mg", price: 8.75, stock: 120 },
  { id: "4", name: "Cetirizine 10mg", price: 6.25, stock: 95 },
  { id: "5", name: "Vitamin C 1000mg", price: 15.99, stock: 200 },
];

const SalesForm = ({
  initialData,
  onSubmit,
  isEditing = false,
}: SalesFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const defaultValues: Partial<SalesFormValues> = {
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    saleDate: new Date(),
    paymentMethod: "",
    items: [
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 0,
    notes: "",
    prescriptionNumber: "",
    ...initialData,
  };

  const form = useForm<SalesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const watchedTaxRate = form.watch("taxRate");

  // Calculate totals whenever items or tax rate changes
  React.useEffect(() => {
    const subtotal = watchedItems.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const discountAmount = (itemTotal * (item.discount || 0)) / 100;
      return sum + (itemTotal - discountAmount);
    }, 0);

    const taxAmount = (subtotal * (watchedTaxRate || 0)) / 100;
    const totalAmount = subtotal + taxAmount;

    form.setValue("subtotal", subtotal);
    form.setValue("taxAmount", taxAmount);
    form.setValue("totalAmount", totalAmount);

    // Update individual item totals
    watchedItems.forEach((item, index) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      const discountAmount = (itemTotal * (item.discount || 0)) / 100;
      form.setValue(`items.${index}.total`, itemTotal - discountAmount);
    });
  }, [watchedItems, watchedTaxRate, form]);

  const handleSubmit = async (data: SalesFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      console.log("Sale data:", data);
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
      unitPrice: 0,
      discount: 0,
      total: 0,
    });
  };

  const selectProduct = (index: number, product: (typeof mockProducts)[0]) => {
    form.setValue(`items.${index}.productId`, product.id);
    form.setValue(`items.${index}.productName`, product.name);
    form.setValue(`items.${index}.unitPrice`, product.price);
    setProductSearch("");
  };

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <Card className="w-full max-w-4xl bg-white">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Sale" : "New Sale"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
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

            {/* Sale Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sale Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="saleDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Sale Date*</FormLabel>
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
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">
                            Credit/Debit Card
                          </SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="digital">
                            Digital Payment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prescriptionNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prescription Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter prescription number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Required for prescription medications
                      </FormDescription>
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

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Discount %</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="w-[300px]">
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
                                {filteredProducts
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((product) => (
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
                                          ${product.price.toFixed(2)}
                                        </div>
                                      </div>
                                      <Badge variant="outline">
                                        Stock: {product.stock}
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
                            name={`items.${index}.unitPrice`}
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

            {/* Totals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Totals</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      placeholder="Enter any additional notes"
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
                    ? "Processing..."
                    : isEditing
                      ? "Update Sale"
                      : "Complete Sale"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SalesForm;
