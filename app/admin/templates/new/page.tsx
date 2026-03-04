"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { OrderFormValues } from "@/lib/validations";
import { PricingConfig, calculateOrderPrice } from "@/lib/utils/pricing";
import { ImageUpload } from "@/components/admin/ImageUpload";
import Link from "next/link";

const occasions = [
  { value: "birthday", label: "Birthday" },
  { value: "wedding", label: "Wedding" },
  { value: "anniversary", label: "Anniversary" },
  { value: "corporate", label: "Corporate Event" },
  { value: "graduation", label: "Graduation" },
  { value: "baby-shower", label: "Baby Shower" },
  { value: "other", label: "Other" },
];

const cakeTypes = [
  { value: "round", label: "Round Cake" },
  { value: "square", label: "Square Cake" },
  { value: "heart", label: "Heart-Shaped" },
  { value: "tiered", label: "Multi-Tiered" },
  { value: "sheet", label: "Sheet Cake" },
  { value: "custom", label: "Custom Shape" },
];

const flavorOptions = [
  "Vanilla",
  "Chocolate",
  "Red Velvet",
  "Lemon",
  "Strawberry",
  "Caramel",
  "Coffee",
  "Coconut",
  "Almond",
  "Carrot",
];

const fillingOptions = [
  "Buttercream",
  "Cream Cheese",
  "Chocolate Ganache",
  "Dark Chocolate Ganache",
  "Fruit Jam",
  "Raspberry Jam",
  "Custard",
  "Whipped Cream",
  "Salted Caramel",
];

const colorOptions = [
  { value: "white", label: "White" },
  { value: "pink", label: "Pink" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "black", label: "Black" },
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Sugar-Free",
  "Egg-Free",
];

export default function NewTemplatePage() {
  const router = useRouter();
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Template display info
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"birthday" | "wedding" | "corporate" | "custom">("birthday");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Template configuration (custom order data)
  const [templateData, setTemplateData] = useState<Partial<OrderFormValues>>({
    occasion: "birthday",
    cakeType: "round",
    servings: 12,
    tiers: 1,
    flavors: [],
    filling: "",
    colorScheme: [],
    designDescription: "",
    dietary: [],
    setupRequired: false,
  });

  // Fetch pricing config on mount
  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => setPricingConfig(data))
      .catch((error) => console.error("Failed to fetch pricing:", error));
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !slug) {
      const autoSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  }, [name, slug]);

  // Sync category with occasion in template
  useEffect(() => {
    if (
      category === "birthday" ||
      category === "wedding" ||
      category === "corporate"
    ) {
      setTemplateData((prev) => ({ ...prev, occasion: category }));
    }
  }, [category]);

  const calculatedPrice = pricingConfig
    ? calculateOrderPrice(templateData, pricingConfig)
    : 0;

  const updateTemplateField = <K extends keyof OrderFormValues>(
    field: K,
    value: OrderFormValues[K]
  ) => {
    setTemplateData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = <K extends keyof OrderFormValues>(
    field: K,
    value: string
  ) => {
    setTemplateData((prev) => {
      const array = (prev[field] as string[]) || [];
      const newArray = array.includes(value)
        ? array.filter((v) => v !== value)
        : [...array, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!name.trim()) {
      setMessage({ type: "error", text: "Template name is required" });
      return;
    }

    if (!slug.trim()) {
      setMessage({ type: "error", text: "Template slug is required" });
      return;
    }

    if (!templateData.flavors || templateData.flavors.length === 0) {
      setMessage({ type: "error", text: "At least one flavor is required" });
      return;
    }

    if (!templateData.designDescription || templateData.designDescription.length < 10) {
      setMessage({ type: "error", text: "Design description must be at least 10 characters" });
      return;
    }

    if (images.length === 0) {
      setMessage({ type: "error", text: "At least one image is required" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          category,
          featured,
          images,
          template_data: templateData,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create template");
      }

      setMessage({
        type: "success",
        text: `Template "${name}" created successfully!`,
      });

      // Redirect to templates list after short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (error: any) {
      console.error("Error saving template:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Create New Cake Template
          </h1>
          <p className="text-muted-foreground mt-2">
            Design a new cake template that customers can order
          </p>
        </div>
        <Link href="/admin/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      {/* Status Message */}
      {message && (
        <Card
          className={
            message.type === "success"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }
        >
          <CardContent className="p-4 flex items-center gap-3">
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p
              className={
                message.type === "success" ? "text-green-900" : "text-red-900"
              }
            >
              {message.text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Template Information */}
      <Card>
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Raspberry White Chocolate Dream"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., raspberry-white-chocolate-dream"
              />
              <p className="text-xs text-muted-foreground">
                Used in the URL: /cakes/{slug}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this cake template..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "birthday" | "wedding" | "corporate" | "custom")
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="birthday">Birthday</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="featured" className="font-normal cursor-pointer">
                Featured on homepage
              </Label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Cake Images *</Label>
            <ImageUpload images={images} onImagesChange={setImages} maxImages={5} />
          </div>
        </CardContent>
      </Card>

      {/* Cake Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Cake Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Occasion & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Occasion *</Label>
              <div className="grid grid-cols-2 gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ.value}
                    type="button"
                    onClick={() => updateTemplateField("occasion", occ.value)}
                    className={`p-3 rounded border-2 transition-all text-sm ${
                      templateData.occasion === occ.value
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cake Type *</Label>
              <div className="grid grid-cols-2 gap-2">
                {cakeTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateTemplateField("cakeType", type.value)}
                    className={`p-3 rounded border-2 transition-all text-sm ${
                      templateData.cakeType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Servings & Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="servings">Servings *</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                max="500"
                value={templateData.servings || 12}
                onChange={(e) =>
                  updateTemplateField("servings", parseInt(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Tiers *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => updateTemplateField("tiers", tier)}
                    className={`w-12 h-12 rounded border-2 transition-all font-bold ${
                      templateData.tiers === tier
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Flavors */}
          <div className="space-y-2">
            <Label>Flavors * (Select one or more)</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {flavorOptions.map((flavor) => {
                const isSelected = templateData.flavors?.includes(flavor);
                return (
                  <button
                    key={flavor}
                    type="button"
                    onClick={() => toggleArrayValue("flavors", flavor)}
                    className={`p-2 rounded border-2 transition-all text-sm ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {flavor}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filling */}
          <div className="space-y-2">
            <Label>Filling/Frosting</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {fillingOptions.map((filling) => (
                <button
                  key={filling}
                  type="button"
                  onClick={() => updateTemplateField("filling", filling)}
                  className={`p-2 rounded border-2 transition-all text-sm ${
                    templateData.filling === filling
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  {filling}
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="space-y-2">
            <Label>Color Scheme * (Select one or more)</Label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {colorOptions.map((color) => {
                const isSelected = templateData.colorScheme?.includes(color.value);
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => toggleArrayValue("colorScheme", color.value)}
                    className={`p-3 rounded border-2 transition-all text-sm ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {color.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Design Description */}
          <div className="space-y-2">
            <Label htmlFor="designDescription">Design Description *</Label>
            <Textarea
              id="designDescription"
              value={templateData.designDescription || ""}
              onChange={(e) =>
                updateTemplateField("designDescription", e.target.value)
              }
              placeholder="Describe the cake design, decorations, themes, text on cake, etc."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters required
            </p>
          </div>

          {/* Dietary */}
          <div className="space-y-2">
            <Label>Dietary Requirements (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dietaryOptions.map((option) => {
                const isSelected = templateData.dietary?.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleArrayValue("dietary", option)}
                    className={`p-2 rounded border-2 transition-all text-sm ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setup Required */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="setupRequired"
              checked={templateData.setupRequired || false}
              onChange={(e) =>
                updateTemplateField("setupRequired", e.target.checked)
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="setupRequired" className="font-normal cursor-pointer">
              Includes venue setup assistance
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Calculated Price Preview */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Calculated Template Price</div>
              <div className="text-4xl font-bold text-primary">
                R {calculatedPrice.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on current pricing configuration
              </p>
            </div>
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Creating Template..." : "Create Template"}
        </Button>
      </div>
    </div>
  );
}
