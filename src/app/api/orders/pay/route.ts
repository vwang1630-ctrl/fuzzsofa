import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient, getAuthenticatedClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.headers.get("x-session") || undefined;
    const supabase = sessionToken
      ? getAuthenticatedClient(sessionToken)
      : getSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderIds, paymentMethod, paymentStatus } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "Order IDs required" }, { status: 400 });
    }

    const isPaid = paymentStatus === "paid";
    const paidStatus = isPaid ? "paid" : "pending_payment";
    const orderStatus = isPaid ? "confirmed" : "pending";

    const updatedOrders = [];
    for (const orderId of orderIds) {
      const { data: order } = await supabase
        .from("orders")
        .select("id, order_number, status, payment_status")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();

      if (!order || order.status !== "pending") {
        continue;
      }

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: orderStatus,
          payment_status: paidStatus,
          payment_method: paymentMethod || "creditcard",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order:", orderId, updateError);
        continue;
      }

      if (isPaid) {
        await supabase.from("shipping_events").insert({
          order_id: orderId,
          status: "confirmed",
          description: "Order confirmed and payment received",
          location: "Fuzz Studio Workshop",
        });
      }

      updatedOrders.push({
        id: orderId,
        order_number: order.order_number,
        status: orderStatus,
        payment_status: paidStatus,
      });
    }

    return NextResponse.json({
      success: true,
      updatedOrders,
      paidCount: updatedOrders.length,
    });
  } catch (error: unknown) {
    console.error("Pay orders error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
