import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { getActiveUserSubscriptionsDb } from "@/lib/billing/subscriptions";
import { createStripeBillingPortalSession } from "@/lib/billing/stripe";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await getActiveUserSubscriptionsDb(user.id);
    const customerId =
      subscriptions.find((subscription) => subscription.provider_customer_id)
        ?.provider_customer_id ?? null;

    if (!customerId) {
      return NextResponse.json(
        { error: "No active Stripe subscription was found for this account." },
        { status: 404 }
      );
    }

    const session = await createStripeBillingPortalSession({
      customerId,
      returnPath: "/account/billing",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal route error:", error);

    return NextResponse.json(
      { error: "Failed to open subscription management" },
      { status: 500 }
    );
  }
}
