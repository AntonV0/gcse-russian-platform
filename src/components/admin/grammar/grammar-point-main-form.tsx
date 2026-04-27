import { updateGrammarPointAction } from "@/app/actions/admin/admin-grammar-point-actions";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { GRAMMAR_TAGS } from "@/lib/curriculum/grammar-tags";
import type { DbGrammarPoint, DbGrammarSet } from "@/lib/grammar/grammar-helpers-db";

export default function GrammarPointMainForm({
  grammarSet,
  grammarPoint,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
}) {
  return (
    <form
      action={updateGrammarPointAction}
      className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <input type="hidden" name="grammarSetId" value={grammarSet.id} />
      <input type="hidden" name="grammarPointId" value={grammarPoint.id} />

      <SectionCard
        title="Teaching content"
        description="This is the main student-facing grammar explanation."
        tone="admin"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField label="Title" required>
              <Input name="title" defaultValue={grammarPoint.title} required />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Slug">
              <Input name="slug" defaultValue={grammarPoint.slug} />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Short description">
              <Textarea
                name="shortDescription"
                rows={4}
                defaultValue={grammarPoint.short_description ?? ""}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Full explanation">
              <Textarea
                name="fullExplanation"
                rows={14}
                defaultValue={grammarPoint.full_explanation ?? ""}
              />
            </FormField>
          </div>

          <FormField label="Spec reference">
            <Input
              name="specReference"
              defaultValue={grammarPoint.spec_reference ?? ""}
            />
          </FormField>

          <FormField label="Grammar tag">
            <Select
              name="grammarTagKey"
              defaultValue={grammarPoint.grammar_tag_key ?? ""}
            >
              <option value="">No tag</option>
              {GRAMMAR_TAGS.map((tag) => (
                <option key={tag.key} value={tag.key}>
                  {tag.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Category key">
            <Input name="categoryKey" defaultValue={grammarPoint.category_key ?? ""} />
          </FormField>

          <FormField label="Tier">
            <Select name="tier" defaultValue={grammarPoint.tier}>
              <option value="both">Both tiers</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="unknown">Unknown</option>
            </Select>
          </FormField>

          <FormField label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              min={0}
              step={1}
              defaultValue={grammarPoint.sort_order}
            />
          </FormField>
        </div>
      </SectionCard>

      <div className="space-y-4">
        <PanelCard title="Publication" tone="admin">
          <div className="space-y-4">
            <CheckboxField
              name="isPublished"
              label="Published"
              defaultChecked={grammarPoint.is_published}
            />

            <div className="flex flex-col gap-3">
              <Button type="submit" variant="primary" icon="save">
                Save point
              </Button>
              <Button
                href={`/admin/grammar/${grammarSet.id}/points`}
                variant="secondary"
                icon="cancel"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PanelCard>
      </div>
    </form>
  );
}
