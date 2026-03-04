"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type PaymentMethod = "card" | "ozow" | "capitec" | "payfast";

function PaymentContent() {
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const orderNumber = searchParams.get("orderNumber");

  const paymentMethods = [
    {
      id: "ozow" as PaymentMethod,
      name: "Ozow",
      description: "Instant EFT payment via your bank",
      icon: Building2,
      available: true,
    },
    {
      id: "capitec" as PaymentMethod,
      name: "CapitecPay",
      description: "Fast & secure Capitec payment",
      icon: Smartphone,
      available: true,
    },
    {
      id: "card" as PaymentMethod,
      name: "Credit/Debit Card",
      description: "Visa, Mastercard accepted",
      icon: CreditCard,
      available: true,
    },
    {
      id: "payfast" as PaymentMethod,
      name: "PayFast",
      description: "Multiple payment options",
      icon: Building2,
      available: true,
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod || !orderId) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: selectedMethod,
          amount: parseFloat(amount || "0"),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Payment initiation failed");
      }

      // Redirect to payment provider
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setPaymentStatus("success");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orderId || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <Card className="max-w-md mx-4" style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A' }}>
          <CardContent className="p-10 text-center">
            <AlertCircle className="w-20 h-20 mx-auto mb-6" style={{ color: '#D4AF37' }} />
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#FFF8E7' }}>Invalid Payment Link</h2>
            <p className="mb-8" style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
              This payment link is invalid or has expired.
            </p>
            <Link href="/cakes">
              <motion.button
                className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                style={{ border: '2px solid #D4AF37', color: '#D4AF37' }}
                whileHover={{ backgroundColor: '#D4AF37', color: '#0A0A0A' }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Gallery
              </motion.button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Card className="max-w-md mx-4" style={{ backgroundColor: '#141414', border: '2px solid #D4AF37', boxShadow: '0 20px 60px rgba(212, 175, 55, 0.2)' }}>
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
              >
                <CheckCircle className="w-24 h-24 mx-auto mb-8" style={{ color: '#D4AF37' }} />
              </motion.div>
              <h2 className="font-black mb-4" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3.5rem)', color: '#FFF8E7' }}>
                Payment Successful!
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255, 248, 231, 0.6)' }}>
                Your order has been confirmed and we'll start preparing your cake.
              </p>
              <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'rgba(20, 20, 20, 0.6)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <p className="text-sm mb-2 uppercase" style={{ color: 'rgba(255, 248, 231, 0.5)', letterSpacing: '0.1em' }}>
                  Order Number
                </p>
                <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{orderNumber}</p>
              </div>
              <p className="text-sm mb-10" style={{ color: 'rgba(255, 248, 231, 0.5)' }}>
                We've sent a confirmation email with all the details.
              </p>
              <Link href="/" className="w-full block">
                <motion.button
                  className="w-full py-4 rounded-lg font-semibold text-lg"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#0A0A0A',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                  }}
                  whileHover={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)', scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Home
                </motion.button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't process your payment. Please try again or contact us for assistance.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setPaymentStatus("idle");
                  setSelectedMethod(null);
                }}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Complete Your Order</h1>
          <p className="text-lg text-muted-foreground">
            Choose your preferred payment method
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-semibold">{orderNumber}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-3xl font-bold text-primary">
                      R{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  All prices include VAT. Delivery fees may apply based on location.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      disabled={!method.available}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      } ${!method.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <method.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{method.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {method.description}
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle className="w-6 h-6 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Payment Info */}
                {selectedMethod && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t pt-6 space-y-4"
                  >
                    {selectedMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" maxLength={5} />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" maxLength={4} type="password" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input id="cardName" placeholder="Name on card" />
                        </div>
                      </div>
                    )}

                    {selectedMethod === "ozow" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          You'll be redirected to Ozow to complete your payment securely via
                          instant EFT from your bank account. Supported banks include FNB,
                          Standard Bank, ABSA, Nedbank, Capitec, and more.
                        </p>
                      </div>
                    )}

                    {selectedMethod === "capitec" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          You'll be redirected to CapitecPay to complete your payment securely
                          using your Capitec banking app or online banking.
                        </p>
                      </div>
                    )}

                    {selectedMethod === "payfast" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          You'll be redirected to PayFast where you can pay via EFT, credit card,
                          or multiple other payment options.
                        </p>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
                      <Lock className="w-4 h-4 mt-0.5 text-green-600" />
                      <div>
                        <p className="font-medium text-foreground mb-1">
                          Secure Payment Processing
                        </p>
                        <p>
                          All payments are processed securely through PCI-DSS compliant South
                          African payment gateways. Your payment information is encrypted and
                          never stored on our servers.
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Pay R{parseFloat(amount || "0").toFixed(2)}
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>SA Based</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-pink-50 border-pink-200 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <p className="text-sm text-gray-700">
                <strong>Need help?</strong> Contact us at{" "}
                <a href="tel:+27210000000" className="text-primary hover:underline">
                  021 000 0000
                </a>{" "}
                or{" "}
                <a href="mailto:orders@cakecompany.co.za" className="text-primary hover:underline">
                  orders@cakecompany.co.za
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payment...</p>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
