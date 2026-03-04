"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cake, Plus, Eye, Star, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { CakeTemplate } from "@/types/cake";
import { PricingConfig, calculateOrderPrice } from "@/lib/utils/pricing";

export default function ProductsPage() {
  const [templates, setTemplates] = useState<CakeTemplate[]>([]);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, pricingRes] = await Promise.all([
        fetch("/api/admin/templates"),
        fetch("/api/pricing"),
      ]);

      const templatesData = await templatesRes.json();
      const pricingData = await pricingRes.json();

      if (templatesData.success) {
        setTemplates(templatesData.templates);
      }
      setPricingConfig(pricingData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (template: CakeTemplate) => {
    try {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: template.id,
          featured: !template.featured,
        }),
      });

      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cake Templates</h1>
          <p className="text-muted-foreground">
            Manage your cake products and templates
          </p>
        </div>
        <Link href="/admin/templates/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Template
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading templates...</p>
          </CardContent>
        </Card>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Cake className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first cake template to get started
            </p>
            <Link href="/admin/templates/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template) => {
            const displayPrice = pricingConfig && template.template_data
              ? calculateOrderPrice(template.template_data, pricingConfig)
              : template.base_price;

            return (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    {template.images[0] && (
                      <img
                        src={template.images[0]}
                        alt={template.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">
                              {template.name}
                            </h3>
                            {template.featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-primary font-semibold">
                              R {displayPrice.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground">
                              {template.servings} servings
                            </span>
                            <span className="text-muted-foreground capitalize">
                              {template.category}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                template.available
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {template.available ? "Available" : "Unavailable"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link href={`/cakes/${template.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-2 h-3 w-3" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeatured(template)}
                      >
                        <Star className="mr-2 h-3 w-3" />
                        {template.featured ? "Unfeature" : "Feature"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
