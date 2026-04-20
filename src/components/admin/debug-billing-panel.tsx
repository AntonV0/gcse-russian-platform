import { createClient } from "@/lib/supabase/server";
import {
  getResolvedHigherUpgradePricingForUserDb,
  getUserGcseRussianPurchaseStateDb,
} from "@/lib/billing/catalog";

type DebugBillingPanelProps = {
  userId: string;
};

type GrantRow = {
  id: string;
  product_id: string;
  price_id: string | null;
  access_mode: string;
  source: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default async function DebugBillingPanel({ userId }: DebugBillingPanelProps) {
  const supabase = await createClient();

  const [{ data: grants }, purchaseState, upgradePricing] = await Promise.all([
    supabase
      .from("user_access_grants")
      .select(
        "id, product_id, price_id, access_mode, source, starts_at, ends_at, is_active, created_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    getUserGcseRussianPurchaseStateDb(userId),
    getResolvedHigherUpgradePricingForUserDb(userId),
  ]);

  const typedGrants = (grants ?? []) as GrantRow[];

  return (
    <section className="app-card app-section-padding border border-amber-300 bg-amber-50/70">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-200 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
            Admin only
          </span>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Billing debug panel
          </h2>
        </div>

        <p className="text-sm text-[var(--text-secondary)]">
          Use this panel to inspect the logged-in user’s grants, price ids, and
          source-aware upgrade resolution.
        </p>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium text-[var(--text-primary)]">Purchase state</h3>
            <pre className="overflow-x-auto rounded-xl bg-white p-3 text-xs text-[var(--text-primary)]">
              {JSON.stringify(purchaseState, null, 2)}
            </pre>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-[var(--text-primary)]">
              Resolved higher upgrade pricing
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-white p-3 text-xs text-[var(--text-primary)]">
              {JSON.stringify(upgradePricing, null, 2)}
            </pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-[var(--text-primary)]">User access grants</h3>

          {typedGrants.length > 0 ? (
            <div className="space-y-3">
              {typedGrants.map((grant) => (
                <div
                  key={grant.id}
                  className="rounded-xl border border-[var(--border-subtle)] bg-white p-4"
                >
                  <div className="grid gap-2 text-sm text-[var(--text-secondary)] md:grid-cols-2">
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        Grant ID:
                      </span>{" "}
                      {grant.id}
                    </div>

                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        Product ID:
                      </span>{" "}
                      {grant.product_id}
                    </div>

                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        Price ID:
                      </span>{" "}
                      {grant.price_id ?? "—"}
                    </div>

                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        Access mode:
                      </span>{" "}
                      {grant.access_mode}
                    </div>

                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        Source:
                      </span>{" "}
                      {grant.source}
                    </div>

                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        Active:
                      </span>{" "}
                      {grant.is_active ? "true" : "false"}
                    </div>

                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        Starts:
                      </span>{" "}
                      {formatDate(grant.starts_at)}
                    </div>

                    <div>
                      <span className="font-medium text-[var(--text-primary)]">
                        Ends:
                      </span>{" "}
                      {formatDate(grant.ends_at)}
                    </div>

                    <div className="md:col-span-2">
                      <span className="font-medium text-[var(--text-primary)]">
                        Created:
                      </span>{" "}
                      {formatDate(grant.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border-subtle)] bg-white p-4 text-sm text-[var(--text-secondary)]">
              No grants found for this user.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
