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

const deliveryItemSchema = z.object({
  productId: z.string().min(1, { message: "Please select a product." }),
  productName: z.string().min(1, { message: "Product name is required." }),
  quantityOrdered: z.coerce
    .number()
    .min(1, { message: "Quantity ordered must be at least 1." }),
  quantityReceived: z.coerce
    .number()
    .min(0, { message: "Quantity received cannot be negative." }),
  unitCost: z.coerce
    .number()
    .min(0.01, { message: "Unit cost must be greater than 0." }),
  expirationDate: z.date().optional(),
  batchNumber: z.string().optional(),
  total: z.coerce.number(),
});

const formSchema = z.object({
  deliveryNoteNumber: z
    .string()
    .min(1, { message: "Delivery note number is required." }),
  supplierName: z.string().min(1, { message: "Supplier name is required." }),
  supplierContact: z.string().optional(),
  deliveryDate: z.date({
    required_error: "Delivery date is required.",
  }),
  purchaseOrderNumber: z.string().optional(),
  items: z
    .array(deliveryItemSchema)
    .min(1, { message: "At least one item is required." }),
  totalAmount: z.coerce.number(),
  notes: z.string().optional(),
  receivedBy: z.string().min(1, { message: "Received by is required." }),
  status: z.string().min(1, { message: "Please select a status." }),
});

type DeliveryNoteFormValues = z.infer<typeof formSchema>;

interface DeliveryNoteFormProps {
  initialData?: Partial<DeliveryNoteFormValues>;
  onSubmit?: (data: DeliveryNoteFormValues) => void;
  isEditing?: boolean;
}

// Mock product data
const mockProducts = [
  { id: "1", name: "Paracetamol 500mg", cost: 3.5 },
  { id: "2", name: "Amoxicillin 250mg", cost: 8.75 },
  { id: "3", name: "Ibuprofen 400mg", cost: 5.25 },
  { id: "4", name: "Cetirizine 10mg", cost: 4.5 },
  { id: "5", name: "Vitamin C 1000mg", cost: 12.99 },
];

const DeliveryNoteForm = ({
  initialData,
  onSubmit,
  isEditing = false,
}: DeliveryNoteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const defaultValues: Partial<DeliveryNoteFormValues> = {
    deliveryNoteNumber: "",
    supplierName: "",
    supplierContact: "",
    deliveryDate: new Date(),
    purchaseOrderNumber: "",
    items: [
      {
        productId: "",
        productName: "",
        quantityOrdered: 1,
        quantityReceived: 0,
        unitCost: 0,
        expirationDate: undefined,
        batchNumber: "",
        total: 0,
      },
    ],
    totalAmount: 0,
    notes: "",
    receivedBy: "",
    status: "pending",
    ...initialData,
  };

  const form = useForm<DeliveryNoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  // Calculate totals whenever items change
  React.useEffect(() => {
    const totalAmount = watchedItems.reduce((sum, item) => {
      const itemTotal = (item.quantityReceived || 0) * (item.unitCost || 0);
      return sum + itemTotal;
    }, 0);

    form.setValue("totalAmount", totalAmount);

    // Update individual item totals
    watchedItems.forEach((item, index) => {
      const itemTotal = (item.quantityReceived || 0) * (item.unitCost || 0);
      form.setValue(`items.${index}.total`, itemTotal);
    });
  }, [watchedItems, form]);

  const handleSubmit = async (data: DeliveryNoteFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      console.log("Delivery note data:", data);
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
      quantityOrdered: 1,
      quantityReceived: 0,
      unitCost: 0,
      expirationDate: undefined,
      batchNumber: "",
      total: 0,
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
          {isEditing ? "Edit Delivery Note" : "New Delivery Note"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Delivery Note Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="deliveryNoteNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Note Number*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter delivery note number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchaseOrderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Order Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PO number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Delivery Date*</FormLabel>
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
              </div>
            </div>

            {/* Supplier Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supplier Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <FormLabel>Supplier Contact</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter contact information"
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
                      <TableHead>Qty Ordered</TableHead>
                      <TableHead>Qty Received</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Total</TableHead>
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
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                      selectProduct(index, product)
                                    }
                                  >
                                    <div className="font-medium">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Cost: ${product.cost.toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantityOrdered`}
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
                            name={`items.${index}.quantityReceived`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
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
                            name={`items.${index}.batchNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Batch #"
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
                            name={`items.${index}.expirationDate`}
                            render={({ field }) => (
                              <FormItem>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className="w-32 pl-3 text-left font-normal"
                                      >
                                        {field.value ? (
                                          format(field.value, "PP")
                                        ) : (
                                          <span className="text-muted-foreground">
                                            Pick date
                                          </span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
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

            {/* Status and Total */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Summary</h3>
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="partial">
                            Partially Received
                          </SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receivedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received By*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter receiver name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    ? "Saving..."
                    : isEditing
                      ? "Update Delivery Note"
                      : "Save Delivery Note"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DeliveryNoteForm;
