import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";

export type BlockEditorProps = {
  blockId: string;
  routeFields: RouteFields;
};

export type BlockEditorAction = (formData: FormData) => void | Promise<void>;
