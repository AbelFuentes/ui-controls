import type * as React from 'react';
import type {
  Size, TableColumn, TableRow, TableSortDetail, TableSelectDetail, TableRowClickDetail,
  UIAccordion, UIAlert, UIAppShell, UICombobox, UIDatePicker, UIEmptyState, UIFileUpload, UIStat, UITagInput, UIText, UIAspectRatio, UIContainer, UIDivider, UINav, UINavGroup, UINavItem, UINavbar, UIPageHeader, UIScrollArea, UISection, UISpacer, UISplit, UIToolbar, UIAvatar, UIBadge, UIBreadcrumb, UIButton, UICard, UICarousel,
  UICheckbox, UIDialog, UIDrawer, UIDropdown, UIGrid, UIInput, UIPagination, UIProgress, UIRadio,
  UIRadioGroup, UISegmented, UISelect, UISkeleton, UISlider, UISpinner, UIStack, UIStepper, UITable,
  UITabs, UITextarea, UIThemeSwitch, UIToaster, UIToggle, UITooltip,
} from './index';

/**
 * Eventos propios. En React 19 se escuchan con el nombre en minúsculas:
 *   <ui-select onchange={(e) => e.detail.value} />
 * (`onChange` camelCase no se dispara con custom elements: es una limitación de React.)
 */
type Ev<D = void> = (event: CustomEvent<D>) => void;
type Plain = (event: Event) => void;

type Base<T extends HTMLElement> = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<T>, T>,
  'onChange'
> & { class?: string; part?: string };

type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
type Tone = 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
type Field = {
  name?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: Size;
};

type UIAccordionProps = Base<UIAccordion> & { multiple?: boolean; onchange?: Ev<{ index: number; open: boolean }> };
type UIAlertProps = Base<UIAlert> & { tone?: 'info' | 'success' | 'warning' | 'danger'; dismissible?: boolean; onclose?: Ev };
type UIAppShellProps = Base<UIAppShell> & {
  collapsed?: boolean; open?: boolean; rail?: boolean; 'no-burger'?: boolean;
  'sidebar-width'?: string | number; 'aside-width'?: string | number;
  'header-height'?: string | number; 'rail-width'?: string | number;
  ontoggle?: Ev<{ open: boolean; collapsed: boolean }>;
};
type UIAvatarProps = Base<UIAvatar> & {
  src?: string; name?: string; alt?: string; square?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {}) | number;
  status?: 'online' | 'busy' | 'away' | 'offline';
};
type UIBadgeProps = Base<UIBadge> & {
  tone?: Tone; variant?: 'soft' | 'solid' | 'outline'; size?: Size; dot?: boolean; pulse?: boolean;
};
type UIBreadcrumbProps = Base<UIBreadcrumb> & { label?: string };
type UIButtonProps = Base<UIButton> & {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost'; size?: Size; type?: 'button' | 'submit' | 'reset';
  pill?: boolean; icon?: boolean; block?: boolean; loading?: boolean; disabled?: boolean; label?: string;
};
type UICardProps = Base<UICard> & {
  variant?: 'elevated' | 'outlined' | 'soft'; padding?: 'none' | 'sm' | 'md' | 'lg'; interactive?: boolean;
};
type UICarouselProps = Base<UICarousel> & {
  'per-view'?: number | string; autoplay?: boolean | number | string; loop?: boolean;
  'no-arrows'?: boolean; 'no-dots'?: boolean; label?: string; onchange?: Ev<{ index: number }>;
};
type UICheckboxProps = Base<UICheckbox> & {
  checked?: boolean; indeterminate?: boolean; disabled?: boolean; size?: Size;
  label?: string; name?: string; value?: string; onchange?: Ev<{ checked: boolean }>;
};
type UIDialogProps = Base<UIDialog> & {
  open?: boolean; size?: 'sm' | 'md' | 'lg' | 'xl'; persistent?: boolean; 'no-close'?: boolean;
  onopen?: Ev; onclose?: Ev;
};
type UIDrawerProps = Base<UIDrawer> & {
  open?: boolean; side?: 'right' | 'left' | 'bottom'; size?: Size; persistent?: boolean; 'no-close'?: boolean;
  onopen?: Ev; onclose?: Ev;
};
type UIDropdownProps = Base<UIDropdown> & {
  placement?: 'bottom-start' | 'bottom-end' | 'bottom' | 'top-start' | 'top-end' | 'top';
  disabled?: boolean; onselect?: Ev<{ value: string }>;
};
type UIGridProps = Base<UIGrid> & {
  cols?: number | string;
  'cols-sm'?: number | string; 'cols-md'?: number | string; 'cols-lg'?: number | string; 'cols-xl'?: number | string;
  min?: string | number; rows?: number | string; gap?: Gap;
  align?: 'start' | 'center' | 'end' | 'stretch'; justify?: 'start' | 'center' | 'end'; dense?: boolean;
};
type UIInputProps = Base<UIInput> & Field & {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search' | (string & {});
  value?: string; placeholder?: string; readonly?: boolean;
  maxlength?: number; minlength?: number; min?: number | string; max?: number | string; step?: number | string;
  pattern?: string; autocomplete?: string; inputmode?: string;
  oninput?: Plain; onchange?: Plain;
};
type UIPaginationProps = Base<UIPagination> & {
  page?: number; pages?: number; siblings?: number; size?: Size; onchange?: Ev<{ page: number }>;
};
type UIProgressProps = Base<UIProgress> & {
  value?: number; max?: number; indeterminate?: boolean; circular?: boolean;
  label?: string; 'show-value'?: boolean; size?: Size;
};
type UIRadioProps = Base<UIRadio> & {
  value?: string; checked?: boolean; disabled?: boolean; size?: Size; label?: string; onchange?: Ev<{ value: string }>;
};
type UIRadioGroupProps = Base<UIRadioGroup> & {
  value?: string; name?: string; label?: string; orientation?: 'vertical' | 'horizontal'; disabled?: boolean;
  onchange?: Ev<{ value: string }>;
};
type UISegmentedProps = Base<UISegmented> & {
  value?: string; size?: Size; disabled?: boolean; label?: string; name?: string; onchange?: Ev<{ value: string }>;
};
type UISelectProps = Base<UISelect> & Field & {
  value?: string; placeholder?: string; onchange?: Ev<{ value: string }>;
};
type UISkeletonProps = Base<UISkeleton> & {
  variant?: 'text' | 'rect' | 'circle'; lines?: number; width?: string | number; height?: string | number;
};
type UISliderProps = Base<UISlider> & {
  value?: number; min?: number; max?: number; step?: number; size?: Size; disabled?: boolean;
  label?: string; name?: string; oninput?: Ev<{ value: number }>; onchange?: Ev<{ value: number }>;
};
type UISpinnerProps = Base<UISpinner> & { size?: 'sm' | 'md' | 'lg' | 'xl'; label?: string };
type UIStackProps = Base<UIStack> & {
  direction?: 'column' | 'row'; gap?: Gap; align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between'; wrap?: boolean;
  divider?: boolean; inline?: boolean; reverse?: boolean; collapse?: Breakpoint;
};
type UIStepperProps = Base<UIStepper> & {
  value?: number; orientation?: 'horizontal' | 'vertical'; clickable?: boolean; size?: Size; label?: string;
  onchange?: Ev<{ value: number }>;
};
type UITableProps = Base<UITable> & {
  /** true / "multiple": casillas · "single": selección única con radio */
  selectable?: boolean | 'single' | 'multiple';
  clickable?: boolean;
  striped?: boolean;
  compact?: boolean;
  loading?: boolean;
  'manual-sort'?: boolean;
  empty?: string;
  label?: string;
  'max-height'?: string;
  'row-key'?: string;
  'sort-key'?: string;
  'sort-dir'?: 'asc' | 'desc';
  columns?: TableColumn[];
  rows?: TableRow[];
  selection?: TableRow[];
  onsort?: Ev<TableSortDetail>;
  onselect?: Ev<TableSelectDetail>;
  onrowclick?: Ev<TableRowClickDetail>;
};
type UITabsProps = Base<UITabs> & {
  value?: string; variant?: 'line' | 'pill'; size?: Size; label?: string; onchange?: Ev<{ value: string }>;
};
type UITextareaProps = Base<UITextarea> & Field & {
  value?: string; placeholder?: string; rows?: number; maxrows?: number; maxlength?: number; minlength?: number;
  autosize?: boolean; counter?: boolean; readonly?: boolean; oninput?: Plain; onchange?: Plain;
};
type UIThemeSwitchProps = Base<UIThemeSwitch> & { size?: Size; label?: string };
type UIToasterProps = Base<UIToaster> & {
  placement?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center';
};
type UIToggleProps = Base<UIToggle> & {
  checked?: boolean; disabled?: boolean; size?: Size; label?: string; name?: string; value?: string;
  onchange?: Ev<{ checked: boolean }>;
};
type UITooltipProps = Base<UITooltip> & {
  text?: string; placement?: 'top' | 'bottom' | 'left' | 'right'; delay?: number;
};

type UIAspectRatioProps = Base<UIAspectRatio> & { ratio?: string | number; fit?: 'cover' | 'contain'; rounded?: boolean };
type UIContainerProps = Base<UIContainer> & {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; padding?: 'none' | 'sm' | 'md' | 'lg'; center?: boolean;
};
type UIDividerProps = Base<UIDivider> & {
  orientation?: 'horizontal' | 'vertical'; align?: 'start' | 'center' | 'end';
  spacing?: 'none' | 'sm' | 'md' | 'lg'; tone?: 'default' | 'strong';
};
type UINavProps = Base<UINav> & {
  value?: string; label?: string; orientation?: 'vertical' | 'horizontal'; rail?: boolean;
  onchange?: Ev<{ value: string }>;
};
type UINavGroupProps = Base<UINavGroup> & {
  label?: string; collapsible?: boolean; collapsed?: boolean; ontoggle?: Ev<{ collapsed: boolean }>;
};
type UINavItemProps = Base<UINavItem> & {
  href?: string; target?: string; value?: string; active?: boolean; disabled?: boolean; label?: string;
};
type UINavbarProps = Base<UINavbar> & {
  sticky?: boolean; variant?: 'surface' | 'transparent'; collapse?: Breakpoint | 'none';
  'links-align'?: 'start' | 'center' | 'end'; open?: boolean; label?: string; ontoggle?: Ev<{ open: boolean }>;
};
type UIPageHeaderProps = Base<UIPageHeader> & {
  heading?: string; description?: string; level?: 1 | 2 | 3 | 4 | 5 | 6; size?: 'md' | 'lg'; divider?: boolean;
};
type UIScrollAreaProps = Base<UIScrollArea> & {
  direction?: 'vertical' | 'horizontal' | 'both'; 'max-height'?: string | number; 'max-width'?: string | number;
  fade?: boolean; 'hide-scrollbar'?: boolean; label?: string;
};
type UISectionProps = Base<UISection> & {
  tone?: 'none' | 'soft' | 'surface' | 'accent' | 'dark'; padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; center?: boolean;
};
type UISpacerProps = Base<UISpacer> & { size?: string | number };
type UISplitProps = Base<UISplit> & {
  side?: 'left' | 'right'; 'aside-width'?: string | number; gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  sticky?: boolean; collapse?: Breakpoint | 'none';
};
type UIToolbarProps = Base<UIToolbar> & {
  variant?: 'plain' | 'surface' | 'soft' | 'floating'; size?: Size; sticky?: boolean; wrap?: boolean;
};

type UIComboboxProps = Base<UICombobox> & Field & {
  value?: string; placeholder?: string; empty?: string; clearable?: boolean; 'allow-custom'?: boolean;
  onchange?: Ev<{ value: string; label: string }>;
};
type UIDatePickerProps = Base<UIDatePicker> & Field & {
  value?: string; min?: string; max?: string; placeholder?: string; locale?: string;
  'week-start'?: 0 | 1 | '0' | '1'; clearable?: boolean;
  onchange?: Ev<{ value: string }>;
};
type UIEmptyStateProps = Base<UIEmptyState> & {
  heading?: string; description?: string; level?: 1 | 2 | 3 | 4 | 5 | 6; size?: Size; bordered?: boolean;
};
type UIFileUploadProps = Base<UIFileUpload> & {
  accept?: string; multiple?: boolean; 'max-size'?: number | string; 'max-files'?: number | string;
  name?: string; label?: string; hint?: string; error?: string; required?: boolean; disabled?: boolean;
  onchange?: Ev<{ files: File[] }>; onreject?: Ev<{ file: File; reason: 'type' | 'size' | 'count' }>;
};
type UIStatProps = Base<UIStat> & {
  label?: string; value?: string | number; delta?: string; trend?: 'up' | 'down' | 'flat';
  invert?: boolean; hint?: string; loading?: boolean;
};
type UITagInputProps = Base<UITagInput> & Field & {
  value?: string; placeholder?: string; max?: number | string; 'allow-duplicates'?: boolean;
  onchange?: Ev<{ tags: string[] }>; onadd?: Ev<{ tag: string }>; onremove?: Ev<{ tag: string }>;
  onreject?: Ev<{ tag: string; reason: 'duplicate' | 'max' }>;
};
type UITextProps = Base<UIText> & {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline' | 'code';
  tone?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'danger';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'; align?: 'start' | 'center' | 'end';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  level?: 1 | 2 | 3 | 4 | 5 | 6; lines?: number; truncate?: boolean; balance?: boolean; inline?: boolean;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ui-accordion': UIAccordionProps;
      'ui-combobox': UIComboboxProps;
      'ui-date-picker': UIDatePickerProps;
      'ui-empty-state': UIEmptyStateProps;
      'ui-file-upload': UIFileUploadProps;
      'ui-stat': UIStatProps;
      'ui-tag-input': UITagInputProps;
      'ui-text': UITextProps;
      'ui-aspect-ratio': UIAspectRatioProps;
      'ui-container': UIContainerProps;
      'ui-divider': UIDividerProps;
      'ui-nav': UINavProps;
      'ui-nav-group': UINavGroupProps;
      'ui-nav-item': UINavItemProps;
      'ui-navbar': UINavbarProps;
      'ui-page-header': UIPageHeaderProps;
      'ui-scroll-area': UIScrollAreaProps;
      'ui-section': UISectionProps;
      'ui-spacer': UISpacerProps;
      'ui-split': UISplitProps;
      'ui-toolbar': UIToolbarProps;
      'ui-alert': UIAlertProps;
      'ui-app-shell': UIAppShellProps;
      'ui-avatar': UIAvatarProps;
      'ui-badge': UIBadgeProps;
      'ui-breadcrumb': UIBreadcrumbProps;
      'ui-button': UIButtonProps;
      'ui-card': UICardProps;
      'ui-carousel': UICarouselProps;
      'ui-checkbox': UICheckboxProps;
      'ui-dialog': UIDialogProps;
      'ui-drawer': UIDrawerProps;
      'ui-dropdown': UIDropdownProps;
      'ui-grid': UIGridProps;
      'ui-input': UIInputProps;
      'ui-pagination': UIPaginationProps;
      'ui-progress': UIProgressProps;
      'ui-radio': UIRadioProps;
      'ui-radio-group': UIRadioGroupProps;
      'ui-segmented': UISegmentedProps;
      'ui-select': UISelectProps;
      'ui-skeleton': UISkeletonProps;
      'ui-slider': UISliderProps;
      'ui-spinner': UISpinnerProps;
      'ui-stack': UIStackProps;
      'ui-stepper': UIStepperProps;
      'ui-table': UITableProps;
      'ui-tabs': UITabsProps;
      'ui-textarea': UITextareaProps;
      'ui-theme-switch': UIThemeSwitchProps;
      'ui-toaster': UIToasterProps;
      'ui-toggle': UIToggleProps;
      'ui-tooltip': UITooltipProps;
    }
  }
}
