"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cake, Plus } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your cake products</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <Cake className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Product Management</h3>
          <p className="text-muted-foreground mb-4">
            Product management features coming soon!
          </p>
          <p className="text-sm text-muted-foreground">
            Currently, products are pre-loaded in the database. You can manage them
            directly in the Supabase dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
