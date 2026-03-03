"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Cake, Users, DollarSign } from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        const orders = ordersData.orders || [];
        const products = productsData.products || [];

        // Calculate stats
        const revenue = orders.reduce(
          (sum: number, order: any) => sum + (order.total_amount || 0),
          0
        );

        // Get unique customers from orders
        const uniqueCustomers = new Set(
          orders.map((order: any) => order.customer_email)
        ).size;

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: uniqueCustomers,
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Cake,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your cake company admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/orders"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">View Orders</h3>
            <p className="text-sm text-muted-foreground">
              Manage customer orders
            </p>
          </a>
          <a
            href="/admin/products"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Cake className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Manage Products</h3>
            <p className="text-sm text-muted-foreground">
              Add or edit cake products
            </p>
          </a>
          <a
            href="/admin/customers"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">View Customers</h3>
            <p className="text-sm text-muted-foreground">
              See customer information
            </p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
