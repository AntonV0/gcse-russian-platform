import AdminLessonBuilderWorkspace from "@/components/admin/admin-lesson-builder-workspace";
import type { AdminLessonBuilderProps } from "@/components/admin/lesson-builder/lesson-builder-types";

export default function AdminLessonBuilder(props: AdminLessonBuilderProps) {
  return <AdminLessonBuilderWorkspace {...props} />;
}
