import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod, amount } = body;

    if (!orderId || !paymentMethod || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required payment parameters",
        },
        { status: 400 }
      );
    }

    let redirectUrl = null;

    switch (paymentMethod) {
      case "ozow":
        redirectUrl = `https://pay.ozow.com/?merchant=DEMO&amount=${amount * 100}&reference=${orderId}`;
        break;

      case "capitec":
        redirectUrl = `https://payment.capitecbank.co.za/pay?amount=${amount}&reference=${orderId}`;
        break;

      case "payfast":
        redirectUrl = `https://www.payfast.co.za/eng/process?amount=${amount}&item_name=Cake Order ${orderId}`;
        break;

      case "card":
        redirectUrl = `https://secure.peachpayments.com/checkout?amount=${amount * 100}&reference=${orderId}`;
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid payment method",
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      redirectUrl,
      paymentMethod,
    });
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initiate payment",
      },
      { status: 500 }
    );
  }
}
