"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Package,
  Cake,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${resolvedParams.id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
        setNotes(data.order.notes || "");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
        alert("Order status updated successfully!");
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "border-orange-500 bg-orange-50",
      confirmed: "border-blue-500 bg-blue-50",
      in_progress: "border-purple-500 bg-purple-50",
      completed: "border-green-500 bg-green-50",
      cancelled: "border-red-500 bg-red-50",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Order not found</h3>
        <Button asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  const statusFlow = [
    { value: "pending", label: "Pending", icon: AlertCircle },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle },
    { value: "in_progress", label: "In Progress", icon: Package },
    { value: "completed", label: "Completed", icon: CheckCircle },
  ];

  const currentStatusIndex = statusFlow.findIndex((s) => s.value === order.status);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{order.order_number}</h1>
          <p className="text-muted-foreground">
            Placed {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Status Progress */}
      <Card className={`border-2 ${getStatusColor(order.status)}`}>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Order Status
            </div>
            <div className="text-2xl font-bold capitalize">
              {order.status.replace("_", " ")}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="flex items-center justify-between mb-6">
            {statusFlow.map((status, index) => {
              const isActive = index <= currentStatusIndex;
              const isCurrent = status.value === order.status;

              return (
                <div key={status.value} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? isCurrent
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-primary text-primary-foreground"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <status.icon className="w-5 h-5" />
                    </div>
                    <div
                      className={`text-xs mt-2 font-medium ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {status.label}
                    </div>
                  </div>
                  {index < statusFlow.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        isActive ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Actions */}
          {order.status !== "completed" && order.status !== "cancelled" && (
            <div className="flex gap-2 flex-wrap">
              {order.status === "pending" && (
                <>
                  <Button onClick={() => updateOrderStatus("confirmed")} disabled={updating}>
                    Confirm Order
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateOrderStatus("cancelled")}
                    disabled={updating}
                  >
                    Cancel Order
                  </Button>
                </>
              )}
              {order.status === "confirmed" && (
                <Button onClick={() => updateOrderStatus("in_progress")} disabled={updating}>
                  Start Baking
                </Button>
              )}
              {order.status === "in_progress" && (
                <Button onClick={() => updateOrderStatus("completed")} disabled={updating}>
                  Mark as Completed
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">{order.customers?.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{order.customers?.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">{order.customers?.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Delivery Address</div>
                    <div className="font-medium">{order.delivery_address}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cake Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Cake Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Occasion</div>
                  <div className="font-medium capitalize">{order.occasion}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Cake Type</div>
                  <div className="font-medium capitalize">{order.cake_type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Servings</div>
                  <div className="font-medium">{order.servings} people</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tiers</div>
                  <div className="font-medium">{order.tiers}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Flavors</div>
                <div className="flex gap-2 flex-wrap">
                  {order.flavors?.map((flavor: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>

              {order.filling && (
                <div>
                  <div className="text-sm text-muted-foreground">Filling/Frosting</div>
                  <div className="font-medium">{order.filling}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-muted-foreground mb-2">Design Description</div>
                <div className="p-3 bg-secondary rounded-lg">
                  {order.design_description}
                </div>
              </div>

              {order.color_scheme && order.color_scheme.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Color Scheme</div>
                  <div className="flex gap-2 flex-wrap">
                    {order.color_scheme.map((color: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-secondary rounded-full text-sm capitalize"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {order.special_requests && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Special Requests</div>
                  <div className="p-3 bg-secondary rounded-lg">
                    {order.special_requests}
                  </div>
                </div>
              )}

              {order.dietary && order.dietary.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Dietary Requirements</div>
                  <div className="flex gap-2 flex-wrap">
                    {order.dietary.map((diet: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {order.allergens && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Allergen Information</div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900">
                    {order.allergens}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notes">Add notes about this order</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special notes, preparation details, or reminders..."
                rows={4}
                className="mt-2"
              />
              <Button
                className="mt-4"
                onClick={() => updateOrderStatus(order.status)}
                disabled={updating}
              >
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">
                    {new Date(order.delivery_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-medium">{order.delivery_time}</div>
                </div>
              </div>

              {order.setup_required && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-900">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Setup assistance required</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Price</span>
                <span className="font-medium">
                  ${order.estimated_price?.toFixed(2) || "0.00"}
                </span>
              </div>

              {order.setup_required && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Setup Fee</span>
                  <span>$25.00</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  $
                  {(
                    (order.final_price || order.estimated_price || 0) +
                    (order.setup_required ? 25 : 0)
                  ).toFixed(2)}
                </span>
              </div>

              <div className="text-xs text-muted-foreground pt-2">
                Payment Status:{" "}
                <span className="capitalize font-medium">{order.payment_status}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
