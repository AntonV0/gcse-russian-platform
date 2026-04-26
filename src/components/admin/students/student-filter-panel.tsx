import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";

export default function StudentFilterPanel({
  q,
  statusFilter,
  accessFilter,
}: {
  q: string;
  statusFilter: string;
  accessFilter: string;
}) {
  return (
    <PanelCard
      className="mb-6"
      title="Find student accounts"
      description="Filter by access, status, name, email, or teaching group."
      tone="admin"
      density="compact"
    >
      <form>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <FormField label="Search">
            <Input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Name, email, or teaching group"
            />
          </FormField>

          <FormField label="Status">
            <Select name="status" defaultValue={statusFilter}>
              <option value="all">All</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </Select>
          </FormField>

          <FormField label="Access">
            <Select name="access" defaultValue={accessFilter}>
              <option value="all">All</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="volna">Volna</option>
              <option value="trial">Trial</option>
              <option value="other">Other</option>
            </Select>
          </FormField>

          <InlineActions className="items-end" align="end">
            <Button type="submit" variant="primary" icon="filter">
              Apply
            </Button>

            <Button href="/admin/students" variant="secondary" icon="back">
              Reset
            </Button>
          </InlineActions>
        </div>
      </form>
    </PanelCard>
  );
}
