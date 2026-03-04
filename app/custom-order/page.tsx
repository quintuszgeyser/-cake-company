"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { StepIndicator } from "@/components/order/StepIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Send, Sparkles, X } from "lucide-react";
import { orderFormSchema, type OrderFormValues } from "@/lib/validations";
import { cakes } from "@/lib/data/cakes";
import { cakeToFormTemplate } from "@/lib/utils/cakeToFormTemplate";

const steps = [
  { title: "Occasion", description: "What are you celebrating?" },
  { title: "Size", description: "How many people are you serving?" },
  { title: "Flavors", description: "Choose your delicious flavors" },
  { title: "Design", description: "Describe your dream cake" },
  { title: "Dietary", description: "Any dietary requirements?" },
  { title: "Delivery", description: "When and where?" },
  { title: "Contact", description: "How can we reach you?" },
];

const occasions = [
  { value: "birthday", label: "🎂 Birthday", emoji: "🎂" },
  { value: "wedding", label: "💍 Wedding", emoji: "💍" },
  { value: "anniversary", label: "💑 Anniversary", emoji: "💑" },
  { value: "corporate", label: "💼 Corporate Event", emoji: "💼" },
  { value: "graduation", label: "🎓 Graduation", emoji: "🎓" },
  { value: "baby-shower", label: "🍼 Baby Shower", emoji: "🍼" },
  { value: "other", label: "✨ Other", emoji: "✨" },
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
  "Vanilla", "Chocolate", "Red Velvet", "Lemon", "Strawberry",
  "Caramel", "Coffee", "Coconut", "Almond", "Carrot"
];

const fillingOptions = [
  "Buttercream", "Cream Cheese", "Chocolate Ganache", "Fruit Jam",
  "Custard", "Whipped Cream", "Salted Caramel"
];

const colorOptions = [
  { value: "white", label: "White", color: "#FFFFFF", border: true },
  { value: "pink", label: "Pink", color: "#FFC0CB" },
  { value: "blue", label: "Blue", color: "#87CEEB" },
  { value: "purple", label: "Purple", color: "#DDA0DD" },
  { value: "gold", label: "Gold", color: "#FFD700" },
  { value: "silver", label: "Silver", color: "#C0C0C0" },
  { value: "red", label: "Red", color: "#FF6B6B" },
  { value: "green", label: "Green", color: "#90EE90" },
  { value: "black", label: "Black", color: "#333333" },
];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free",
  "Nut-Free", "Sugar-Free", "Egg-Free"
];

function CustomOrderForm() {
  const searchParams = useSearchParams();
  const cakeId = searchParams.get('cakeId');
  const templateCake = cakeId ? cakes.find(c => c.id === cakeId) : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      tiers: 1,
      servings: 12,
      flavors: [],
      colorScheme: [],
      dietary: [],
      setupRequired: false,
    },
  });

  const formValues = watch();

  // Apply template when cakeId changes
  useEffect(() => {
    if (templateCake) {
      const template = cakeToFormTemplate(templateCake);
      // Set each field individually to ensure they're applied
      Object.entries(template).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof OrderFormValues, value as any);
        }
      });
    }
  }, [templateCake, setValue]);

  const calculatePrice = () => {
    let basePrice = 50;
    const servings = formValues.servings || 12;
    const tiers = formValues.tiers || 1;

    basePrice += (servings / 10) * 15;
    basePrice += (tiers - 1) * 30;

    if (formValues.dietary?.includes("Vegan") || formValues.dietary?.includes("Gluten-Free")) {
      basePrice += 15;
    }

    return Math.round(basePrice);
  };

  const onSubmit = async (data: OrderFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          estimatedPrice: calculatePrice(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit order");
      }

      // Success - redirect to payment
      window.location.href = `/payment?orderId=${result.order.id}&amount=${result.order.estimatedPrice}&orderNumber=${result.order.orderNumber}`;
    } catch (error: any) {
      console.error("Order submission error:", error);
      alert(`Error submitting order: ${error.message}\n\nPlease try again or contact us directly.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 text-xs font-medium uppercase"
            style={{
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#D4AF37',
              letterSpacing: '0.1em'
            }}
          >
            <Sparkles className="w-4 h-4" />
            Custom Cake Designer
          </div>
          <h1
            className="font-black mb-6"
            style={{
              fontSize: 'clamp(3rem, 6vw, 6rem)',
              color: '#FFF8E7'
            }}
          >
            Design Your<br />
            <span style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Dream Cake
            </span>
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
            Let's create something extraordinary together
          </p>
        </motion.div>

        {/* Template Indicator */}
        {templateCake && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="flex items-center gap-4 p-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <img
                src={templateCake.images[0]}
                alt={templateCake.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
                  Pre-filled based on:
                </p>
                <p style={{ color: '#FFF8E7' }}>{templateCake.name}</p>
              </div>
              <button
                type="button"
                onClick={() => window.location.href = '/custom-order'}
                className="p-2 rounded-lg hover:bg-black/20 transition-colors"
                style={{ color: '#999' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card
            className="mb-8"
            style={{
              backgroundColor: '#141414',
              border: '1px solid #2A2A2A',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            <CardContent className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {/* Step 1: Occasion */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label>Select Occasion *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {occasions.map((occasion) => (
                          <button
                            key={occasion.value}
                            type="button"
                            onClick={() => setValue("occasion", occasion.value)}
                            className={`p-4 rounded-lg border-2 transition-all text-center hover:border-primary ${
                              formValues.occasion === occasion.value
                                ? "border-primary bg-primary/5"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="text-3xl mb-2">{occasion.emoji}</div>
                            <div className="text-sm font-medium">
                              {occasion.label.replace(occasion.emoji + " ", "")}
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.occasion && (
                        <p className="text-sm text-destructive">{errors.occasion.message}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>Cake Type *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {cakeTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setValue("cakeType", type.value)}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              formValues.cakeType === type.value
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                      {errors.cakeType && (
                        <p className="text-sm text-destructive">{errors.cakeType.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Size & Servings */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label htmlFor="servings">Number of Servings *</Label>
                      <Input
                        id="servings"
                        type="number"
                        min="1"
                        max="500"
                        {...register("servings", { valueAsNumber: true })}
                        placeholder="e.g., 50"
                      />
                      {errors.servings && (
                        <p className="text-sm text-destructive">{errors.servings.message}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Current selection: <strong>{formValues.servings || 0} people</strong>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="tiers">Number of Tiers *</Label>
                      <div className="grid grid-cols-5 gap-3">
                        {[1, 2, 3, 4, 5].map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setValue("tiers", tier)}
                            className={`aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-2xl font-bold ${
                              formValues.tiers === tier
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                      {errors.tiers && (
                        <p className="text-sm text-destructive">{errors.tiers.message}</p>
                      )}
                    </div>

                    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Estimated Price</div>
                            <div className="text-3xl font-bold text-primary">
                              R{calculatePrice()}
                            </div>
                          </div>
                          <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Final price will be confirmed after design review
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Flavors */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label>Cake Flavors * (Select one or more per tier)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {flavorOptions.map((flavor) => {
                          const isSelected = formValues.flavors?.includes(flavor);
                          return (
                            <button
                              key={flavor}
                              type="button"
                              onClick={() => {
                                const current = formValues.flavors || [];
                                if (isSelected) {
                                  setValue(
                                    "flavors",
                                    current.filter((f) => f !== flavor)
                                  );
                                } else {
                                  setValue("flavors", [...current, flavor]);
                                }
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
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
                      {errors.flavors && (
                        <p className="text-sm text-destructive">{errors.flavors.message}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="filling">Filling/Frosting</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {fillingOptions.map((filling) => (
                          <button
                            key={filling}
                            type="button"
                            onClick={() => setValue("filling", filling)}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              formValues.filling === filling
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                          >
                            {filling}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Design */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label htmlFor="designDescription">Design Description *</Label>
                      <Textarea
                        id="designDescription"
                        {...register("designDescription")}
                        placeholder="Describe your dream cake design in detail... (colors, themes, decorations, text on cake, etc.)"
                        rows={5}
                      />
                      {errors.designDescription && (
                        <p className="text-sm text-destructive">
                          {errors.designDescription.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>Color Scheme * (Select one or more)</Label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {colorOptions.map((color) => {
                          const isSelected = formValues.colorScheme?.includes(color.value);
                          return (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => {
                                const current = formValues.colorScheme || [];
                                if (isSelected) {
                                  setValue(
                                    "colorScheme",
                                    current.filter((c) => c !== color.value)
                                  );
                                } else {
                                  setValue("colorScheme", [...current, color.value]);
                                }
                              }}
                              className={`aspect-square rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                isSelected
                                  ? "border-primary ring-2 ring-primary/20"
                                  : color.border
                                  ? "border-gray-300"
                                  : "border-transparent"
                              }`}
                              style={{ backgroundColor: color.color }}
                            >
                              <div className="text-xs font-medium text-gray-700">
                                {color.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.colorScheme && (
                        <p className="text-sm text-destructive">{errors.colorScheme.message}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        {...register("specialRequests")}
                        placeholder="Any special decorations, text, or other requests..."
                        rows={3}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Dietary */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label>Dietary Requirements (Optional)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {dietaryOptions.map((option) => {
                          const isSelected = formValues.dietary?.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                const current = formValues.dietary || [];
                                if (isSelected) {
                                  setValue(
                                    "dietary",
                                    current.filter((d) => d !== option)
                                  );
                                } else {
                                  setValue("dietary", [...current, option]);
                                }
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
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

                    <div className="space-y-4">
                      <Label htmlFor="allergens">Allergen Information</Label>
                      <Textarea
                        id="allergens"
                        {...register("allergens")}
                        placeholder="Please list any specific allergens or ingredients to avoid..."
                        rows={3}
                      />
                    </div>

                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <p className="text-sm text-blue-900">
                          💡 <strong>Note:</strong> Special dietary requirements may affect the
                          final price and require additional preparation time.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 6: Delivery */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label htmlFor="deliveryDate">Delivery Date *</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          {...register("deliveryDate")}
                          min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]}
                        />
                        {errors.deliveryDate && (
                          <p className="text-sm text-destructive">
                            {errors.deliveryDate.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Minimum 3 days notice required
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="deliveryTime">Delivery Time *</Label>
                        <Input
                          id="deliveryTime"
                          type="time"
                          {...register("deliveryTime")}
                        />
                        {errors.deliveryTime && (
                          <p className="text-sm text-destructive">
                            {errors.deliveryTime.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                      <Textarea
                        id="deliveryAddress"
                        {...register("deliveryAddress")}
                        placeholder="Full delivery address including street, city, zip code..."
                        rows={3}
                      />
                      {errors.deliveryAddress && (
                        <p className="text-sm text-destructive">
                          {errors.deliveryAddress.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="setupRequired"
                        {...register("setupRequired")}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="setupRequired" className="font-normal cursor-pointer">
                        I need setup assistance at the venue (+$25)
                      </Label>
                    </div>
                  </motion.div>
                )}

                {/* Step 7: Contact */}
                {currentStep === 7 && (
                  <motion.div
                    key="step7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        {...register("customerName")}
                        placeholder="John Doe"
                      />
                      {errors.customerName && (
                        <p className="text-sm text-destructive">
                          {errors.customerName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Order Summary */}
                    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Occasion:</span>
                            <span className="font-medium capitalize">
                              {formValues.occasion || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Servings:</span>
                            <span className="font-medium">{formValues.servings || 0} people</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tiers:</span>
                            <span className="font-medium">{formValues.tiers || 1}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Flavors:</span>
                            <span className="font-medium">
                              {formValues.flavors?.join(", ") || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Delivery Date:</span>
                            <span className="font-medium">{formValues.deliveryDate || "-"}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between items-center">
                            <span className="font-semibold">Estimated Total:</span>
                            <span className="text-2xl font-bold text-primary">
                              R{calculatePrice()}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You'll receive a detailed quote within 24 hours
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep} size="lg">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Order
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-20 flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse" style={{ color: '#D4AF37' }} />
          <p style={{ color: '#FFF8E7' }}>Loading your custom order form...</p>
        </div>
      </div>
    }>
      <CustomOrderForm />
    </Suspense>
  );
}
