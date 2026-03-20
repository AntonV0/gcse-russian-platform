import {
  getCurrentUserTeachingGroupMembershipsDb,
  getTeachingGroupsForCurrentUserDb,
  getCurrentUserVolnaGroupsDb,
} from "@/lib/volna-helpers-db";
import { getCurrentCourseVariantAccessGrantDb } from "@/lib/access-helpers-db";

export default async function DebugVolnaPage() {
  const memberships = await getCurrentUserTeachingGroupMembershipsDb();
  const groups = await getTeachingGroupsForCurrentUserDb();
  const volnaGroups = await getCurrentUserVolnaGroupsDb();
  const volnaGrant = await getCurrentCourseVariantAccessGrantDb(
    "gcse-russian",
    "volna"
  );

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Volna Debug</h1>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Volna Grant</h2>
        <pre className="overflow-auto rounded border p-4 text-sm">
          {JSON.stringify(volnaGrant, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Memberships</h2>
        <pre className="overflow-auto rounded border p-4 text-sm">
          {JSON.stringify(memberships, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Groups</h2>
        <pre className="overflow-auto rounded border p-4 text-sm">
          {JSON.stringify(groups, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Volna Groups</h2>
        <pre className="overflow-auto rounded border p-4 text-sm">
          {JSON.stringify(volnaGroups, null, 2)}
        </pre>
      </section>
    </main>
  );
}