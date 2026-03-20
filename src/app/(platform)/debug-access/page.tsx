import { getCurrentCourseVariantAccessGrantDb } from "@/lib/access-helpers-db";

export default async function DebugAccessPage() {
  const foundationGrant = await getCurrentCourseVariantAccessGrantDb(
    "gcse-russian",
    "foundation"
  );

  const higherGrant = await getCurrentCourseVariantAccessGrantDb(
    "gcse-russian",
    "higher"
  );

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Access Debug</h1>
      </div>

      <pre className="rounded border p-4 text-sm overflow-auto">
        {JSON.stringify(
          {
            foundationGrant,
            higherGrant,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}