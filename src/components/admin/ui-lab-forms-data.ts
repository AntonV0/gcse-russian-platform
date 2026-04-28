export const FORM_PAGE_NAV_ITEMS = [
  { id: "field-basics", label: "Field basics" },
  { id: "validation", label: "Validation" },
  { id: "dense-controls", label: "Dense controls" },
  { id: "builder-rows", label: "Builder rows" },
  { id: "sectioned-form", label: "Sectioned form" },
  { id: "states", label: "States" },
  { id: "future-components", label: "Future" },
];

export const COURSE_VARIANT_OPTIONS = [
  { value: "foundation", label: "Foundation" },
  { value: "higher", label: "Higher" },
  { value: "volna", label: "Volna" },
];

export const VARIANT_FILTER_OPTIONS = [
  { value: "all", label: "All variants" },
  ...COURSE_VARIANT_OPTIONS,
];

export const ALL_VARIANT_FILTER_OPTIONS = [
  { value: "all-variants", label: "All variants" },
  ...COURSE_VARIANT_OPTIONS,
];

export const BLOCK_TYPE_OPTIONS = [
  { value: "content", label: "content" },
  { value: "practice", label: "practice" },
  { value: "summary", label: "summary" },
];

export const CONTENT_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "review", label: "Needs review" },
];

export const SECTIONED_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In review" },
  { value: "published", label: "Published" },
];

export const ALL_STATUS_FILTER_OPTIONS = [
  { value: "all-statuses", label: "All statuses" },
  ...CONTENT_STATUS_OPTIONS,
];

export const FORMS_FUTURE_ITEMS = [
  "RadioGroupField for tier, plan, and visibility choices.",
  "ToggleField for binary settings that need switch-style affordance.",
  "FileUploadField for images, audio, and assignment submissions.",
  "DateTimeField for assignments, exam windows, and scheduling.",
  "FormValidationSummary for large admin edit screens.",
  "AutosaveStatus for future lesson-builder editing flows.",
];
