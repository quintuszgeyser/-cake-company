"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Save, AlertCircle, CheckCircle } from "lucide-react";
import { PricingConfig } from "@/lib/utils/pricing";

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadPricingConfig();
  }, []);

  const loadPricingConfig = async () => {
    try {
      const res = await fetch("/api/pricing");
      if (!res.ok) throw new Error("Failed to fetch pricing config");
      const data = await res.json();
      setConfig(data);
    } catch (error: any) {
      console.error("Error loading pricing:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base_price: config.base_price,
          price_per_serving: config.price_per_serving,
          price_per_tier: config.price_per_tier,
          vegan_surcharge: config.vegan_surcharge,
          gluten_free_surcharge: config.gluten_free_surcharge,
          dairy_free_surcharge: config.dairy_free_surcharge,
          nut_free_surcharge: config.nut_free_surcharge,
          sugar_free_surcharge: config.sugar_free_surcharge,
          setup_fee: config.setup_fee,
          rush_delivery_fee: config.rush_delivery_fee,
          flavor_premiums: config.flavor_premiums,
          filling_premiums: config.filling_premiums,
          notes: config.notes,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update pricing");
      }

      setMessage({
        type: "success",
        text: "Pricing configuration updated successfully! All cake prices will now use the new values.",
      });

      // Reload to get fresh data including updated_at timestamp
      await loadPricingConfig();
    } catch (error: any) {
      console.error("Error saving pricing:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof PricingConfig, value: number | string) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading pricing configuration...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load pricing configuration</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-primary" />
          Pricing Configuration
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage pricing for all cake orders. Changes apply immediately to the custom order form and all
          template prices.
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <Card className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardContent className="p-4 flex items-center gap-3">
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={message.type === "success" ? "text-green-900" : "text-red-900"}>
              {message.text}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Base Pricing</CardTitle>
            <CardDescription>Fundamental pricing components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price (R)</Label>
              <Input
                id="base_price"
                type="number"
                step="0.01"
                min="0"
                value={config.base_price}
                onChange={(e) => updateField("base_price", parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Starting price for any cake order
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_serving">Price Per Serving (R)</Label>
              <Input
                id="price_per_serving"
                type="number"
                step="0.01"
                min="0"
                value={config.price_per_serving}
                onChange={(e) => updateField("price_per_serving", parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Cost added per person served
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_tier">Price Per Additional Tier (R)</Label>
              <Input
                id="price_per_tier"
                type="number"
                step="0.01"
                min="0"
                value={config.price_per_tier}
                onChange={(e) => updateField("price_per_tier", parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Cost for each tier beyond the first
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dietary Surcharges */}
        <Card>
          <CardHeader>
            <CardTitle>Dietary Surcharges</CardTitle>
            <CardDescription>Additional costs for special dietary requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vegan_surcharge">Vegan Surcharge (R)</Label>
              <Input
                id="vegan_surcharge"
                type="number"
                step="0.01"
                min="0"
                value={config.vegan_surcharge}
                onChange={(e) => updateField("vegan_surcharge", parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gluten_free_surcharge">Gluten-Free Surcharge (R)</Label>
              <Input
                id="gluten_free_surcharge"
                type="number"
                step="0.01"
                min="0"
                value={config.gluten_free_surcharge}
                onChange={(e) => updateField("gluten_free_surcharge", parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dairy_free_surcharge">Dairy-Free Surcharge (R)</Label>
              <Input
                id="dairy_free_surcharge"
                type="number"
                step="0.01"
                min="0"
                value={config.dairy_free_surcharge}
                onChange={(e) => updateField("dairy_free_surcharge", parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nut_free_surcharge">Nut-Free Surcharge (R)</Label>
              <Input
                id="nut_free_surcharge"
                type="number"
                step="0.01"
                min="0"
                value={config.nut_free_surcharge}
                onChange={(e) => updateField("nut_free_surcharge", parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sugar_free_surcharge">Sugar-Free Surcharge (R)</Label>
              <Input
                id="sugar_free_surcharge"
                type="number"
                step="0.01"
                min="0"
                value={config.sugar_free_surcharge}
                onChange={(e) => updateField("sugar_free_surcharge", parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Fees</CardTitle>
            <CardDescription>Extra service charges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="setup_fee">Venue Setup Fee (R)</Label>
              <Input
                id="setup_fee"
                type="number"
                step="0.01"
                min="0"
                value={config.setup_fee}
                onChange={(e) => updateField("setup_fee", parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Fee for on-site setup assistance
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rush_delivery_fee">Rush Delivery Fee (R)</Label>
              <Input
                id="rush_delivery_fee"
                type="number"
                step="0.01"
                min="0"
                value={config.rush_delivery_fee}
                onChange={(e) => updateField("rush_delivery_fee", parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Fee for expedited orders (less than 3 days notice)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Notes</CardTitle>
            <CardDescription>Internal notes about pricing changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={6}
                value={config.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Add any notes about this pricing configuration..."
              />
            </div>

            {config.updated_at && (
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(config.updated_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Premium Pricing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Premium Pricing (Advanced)</CardTitle>
          <CardDescription>
            Flavor and filling premiums are stored as JSON objects. To edit these, use the JSON editor
            below or contact a developer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Flavor Premiums</Label>
              <pre className="bg-secondary p-3 rounded text-xs overflow-auto">
                {JSON.stringify(config.flavor_premiums, null, 2)}
              </pre>
              <p className="text-xs text-muted-foreground">
                Example: Red Velvet adds R5, Caramel adds R3
              </p>
            </div>

            <div className="space-y-2">
              <Label>Filling Premiums</Label>
              <pre className="bg-secondary p-3 rounded text-xs overflow-auto">
                {JSON.stringify(config.filling_premiums, null, 2)}
              </pre>
              <p className="text-xs text-muted-foreground">
                Example: Dark Chocolate Ganache adds R8, Salted Caramel adds R10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={loadPricingConfig}
          disabled={saving}
        >
          Reset Changes
        </Button>
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Pricing Configuration"}
        </Button>
      </div>

      {/* Pricing Calculator Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Example Calculation</CardTitle>
          <CardDescription>
            Preview how the current pricing affects a sample order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary p-4 rounded space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>R {config.base_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ Servings (12 × R{config.price_per_serving}):</span>
              <span>R {(12 * config.price_per_serving).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ Additional Tiers (1 × R{config.price_per_tier}):</span>
              <span>R {config.price_per_tier.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ Vegan Surcharge:</span>
              <span>R {config.vegan_surcharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ Setup Fee:</span>
              <span>R {config.setup_fee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Example Total:</span>
              <span>
                R{" "}
                {(
                  config.base_price +
                  12 * config.price_per_serving +
                  config.price_per_tier +
                  config.vegan_surcharge +
                  config.setup_fee
                ).toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Example: 12 servings, 2 tiers, Vegan, with setup
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
