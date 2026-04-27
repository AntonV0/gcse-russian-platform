export function isSubscriptionActiveStatus(status: string): boolean {
  return ["active", "trialing"].includes(status);
}

export function shouldDeactivateStripeSubscriptionAccess(status: string): boolean {
  return !isSubscriptionActiveStatus(status);
}
