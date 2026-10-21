/// <reference path="./react.d.ts" />

export type Size = 'sm' | 'md' | 'lg';

/* ───────── tema ───────── */
export type Theme = 'light' | 'dark';
export interface SetThemeOptions {
  persist?: boolean;
  animate?: boolean;
  origin?: { x: number; y: number };
}
export function getTheme(): Theme;
export function setTheme(theme: Theme, options?: SetThemeOptions): void;
export function toggleTheme(options?: SetThemeOptions): void;
export function initTheme(): void;

/* ───────── toast ───────── */
export interface ToastOptions {
  title?: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  duration?: number;
}
export interface Toast {
  (message: string, options?: ToastOptions): () => void;
  info(message: string, options?: ToastOptions): () => void;
  success(message: string, options?: ToastOptions): () => void;
  warning(message: string, options?: ToastOptions): () => void;
  danger(message: string, options?: ToastOptions): () => void;
}
export const toast: Toast;

/* ───────── table ───────── */
export type TableRow = Record<string, any>;
export interface TableColumn<R = TableRow> {
  key: string;
  label?: string;
  sortable?: boolean;
  hidden?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (row: R) => Node | string | number | null | undefined;
  /** Valor usado para ordenar cuando difiere del mostrado. */
  sortValue?: (row: R) => string | number | null | undefined;
}
export interface TableSortDetail { key: string | null; dir: 'asc' | 'desc' | null }
export interface TableSelectDetail<R = TableRow> { rows: R[]; keys: unknown[] }
export interface TableRowClickDetail<R = TableRow> { row: R; index: number }
export interface UITableEventMap {
  sort: CustomEvent<TableSortDetail>;
  select: CustomEvent<TableSelectDetail>;
  rowclick: CustomEvent<TableRowClickDetail>;
}

/* ───────── elementos ───────── */
export class UIAccordion extends HTMLElement {}
export class UIAlert extends HTMLElement {
  dismiss(): void;
  show(): void;
}
export class UIAppShell extends HTMLElement {
  readonly mobile: boolean;
  toggle(): void;
  close(): void;
}
export class UIAvatar extends HTMLElement {}
export class UIBadge extends HTMLElement {}
export class UIBreadcrumb extends HTMLElement {}
export class UIButton extends HTMLElement {
  type: 'button' | 'submit' | 'reset';
  disabled: boolean;
  loading: boolean;
  focus(options?: FocusOptions): void;
}
export class UICard extends HTMLElement {}
export class UICarousel extends HTMLElement {
  index: number;
  next(): void;
  prev(): void;
  goTo(index: number): void;
}
export class UICheckbox extends HTMLElement {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
}
export class UIDialog extends HTMLElement {
  open: boolean;
  show(): void;
  close(): void;
}
export class UIDrawer extends UIDialog {}
export class UIDropdown extends HTMLElement {
  open(): void;
  close(refocus?: boolean): void;
  toggle(): void;
}
export class UIGrid extends HTMLElement {}
export class UIInput extends HTMLElement {
  value: string;
  type: string;
  readonly validity: ValidityState;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
  select(): void;
}
export class UIPagination extends HTMLElement {
  page: number;
  pages: number;
}
export class UIProgress extends HTMLElement {
  value: number;
}
export class UIRadio extends HTMLElement {
  value: string;
  checked: boolean;
  disabled: boolean;
  focus(options?: FocusOptions): void;
}
export class UIRadioGroup extends HTMLElement {
  value: string;
}
export class UISegmented extends HTMLElement {
  value: string;
  disabled: boolean;
}
export class UISelect extends HTMLElement {
  value: string;
  disabled: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
}
export class UISkeleton extends HTMLElement {}
export class UISlider extends HTMLElement {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
}
export class UISpinner extends HTMLElement {}
export class UIStack extends HTMLElement {}
export class UIStepper extends HTMLElement {
  value: number;
  next(): void;
  prev(): void;
}
export class UITable extends HTMLElement {
  columns: TableColumn[];
  rows: TableRow[];
  /** Filas seleccionadas (get) o selección inicial (set). */
  selection: TableRow[];
  /** Claves de las filas seleccionadas (`row-key`; sin clave, las filas mismas). */
  readonly selectedKeys: unknown[];
  clearSelection(): void;
  addEventListener<K extends keyof UITableEventMap>(type: K, listener: (this: UITable, ev: UITableEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: UITable, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof UITableEventMap>(type: K, listener: (this: UITable, ev: UITableEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: UITable, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
export class UITabs extends HTMLElement {
  value: string;
}
export class UITextarea extends HTMLElement {
  value: string;
  readonly validity: ValidityState;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
  select(): void;
}
export class UIThemeSwitch extends HTMLElement {}
export class UIToaster extends HTMLElement {
  push(message: string, options?: ToastOptions): () => void;
}
export class UIToggle extends HTMLElement {
  checked: boolean;
  disabled: boolean;
}
export class UITooltip extends HTMLElement {}

export class UIAspectRatio extends HTMLElement {}
export class UIContainer extends HTMLElement {}
export class UIDivider extends HTMLElement {}
export class UINav extends HTMLElement {
  value: string;
}
export class UINavGroup extends HTMLElement {}
export class UINavItem extends HTMLElement {
  active: boolean;
  disabled: boolean;
  focus(options?: FocusOptions): void;
}
export class UINavbar extends HTMLElement {
  open: boolean;
  toggle(): void;
  close(): void;
}
export class UIPageHeader extends HTMLElement {}
export class UIScrollArea extends HTMLElement {}
export class UISection extends HTMLElement {}
export class UISpacer extends HTMLElement {}
export class UISplit extends HTMLElement {}
export class UIToolbar extends HTMLElement {}

export class UICombobox extends HTMLElement {
  value: string;
  disabled: boolean;
  readonly query: string;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
}
export class UIDatePicker extends HTMLElement {
  value: string;
  disabled: boolean;
  readonly valueAsDate: Date | null;
  open(): void;
  close(refocus?: boolean): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
}
export class UIEmptyState extends HTMLElement {}
export class UIFileUpload extends HTMLElement {
  readonly files: File[];
  disabled: boolean;
  clear(): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
}
export class UIStat extends HTMLElement {}
export class UITagInput extends HTMLElement {
  tags: string[];
  value: string;
  disabled: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
}
export class UIText extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'ui-accordion': UIAccordion;
    'ui-combobox': UICombobox;
    'ui-date-picker': UIDatePicker;
    'ui-empty-state': UIEmptyState;
    'ui-file-upload': UIFileUpload;
    'ui-stat': UIStat;
    'ui-tag-input': UITagInput;
    'ui-text': UIText;
    'ui-aspect-ratio': UIAspectRatio;
    'ui-container': UIContainer;
    'ui-divider': UIDivider;
    'ui-nav': UINav;
    'ui-nav-group': UINavGroup;
    'ui-nav-item': UINavItem;
    'ui-navbar': UINavbar;
    'ui-page-header': UIPageHeader;
    'ui-scroll-area': UIScrollArea;
    'ui-section': UISection;
    'ui-spacer': UISpacer;
    'ui-split': UISplit;
    'ui-toolbar': UIToolbar;
    'ui-alert': UIAlert;
    'ui-app-shell': UIAppShell;
    'ui-avatar': UIAvatar;
    'ui-badge': UIBadge;
    'ui-breadcrumb': UIBreadcrumb;
    'ui-button': UIButton;
    'ui-card': UICard;
    'ui-carousel': UICarousel;
    'ui-checkbox': UICheckbox;
    'ui-dialog': UIDialog;
    'ui-drawer': UIDrawer;
    'ui-dropdown': UIDropdown;
    'ui-grid': UIGrid;
    'ui-input': UIInput;
    'ui-pagination': UIPagination;
    'ui-progress': UIProgress;
    'ui-radio': UIRadio;
    'ui-radio-group': UIRadioGroup;
    'ui-segmented': UISegmented;
    'ui-select': UISelect;
    'ui-skeleton': UISkeleton;
    'ui-slider': UISlider;
    'ui-spinner': UISpinner;
    'ui-stack': UIStack;
    'ui-stepper': UIStepper;
    'ui-table': UITable;
    'ui-tabs': UITabs;
    'ui-textarea': UITextarea;
    'ui-theme-switch': UIThemeSwitch;
    'ui-toaster': UIToaster;
    'ui-toggle': UIToggle;
    'ui-tooltip': UITooltip;
  }
}
