import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";

export type AddBlockFormProps = {
  sectionId: string;
  routeFields: RouteFields;
};

export type AddBlockAction = (formData: FormData) => void | Promise<void>;
