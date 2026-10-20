---
name: Civic Data Standard
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#49607c'
  primary: '#001428'
  on-primary: '#ffffff'
  primary-container: '#0f2942'
  on-primary-container: '#7991af'
  inverse-primary: '#b0c9e8'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#0a0050'
  on-tertiary: '#ffffff'
  tertiary-container: '#19008b'
  on-tertiary-container: '#847fff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b0c9e8'
  on-primary-fixed: '#011d35'
  on-primary-fixed-variant: '#314863'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#e3dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#100069'
  on-tertiary-fixed-variant: '#372abf'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  tabular-data:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system serves municipal civil servants, GIS specialists, policy analysts, and regional planning directors. The visual environment prioritizes trust, uncompromised readability, administrative rigor, and public sector accountability. 

The aesthetic is Modern Utilitarian with institutional clarity:
- **Tone:** Authoritative, measured, transparent, and precise.
- **Visual Style:** High-density enterprise layout, low cognitive load, strictly defined 1px structural line work, and accessible contrast ratios (WCAG 2.1 AAA where applicable, AA absolute floor).
- **Core Principles:** Information density without visual clutter, explicit state indicators for audits and revisions, and instant optical recognition of permissions and security tiers.

## Colors

The palette establishes an institutional foundation with deliberate civic accents and distinct semantic roles:

- **Primary (`#0F2942` - Institutional Deep Navy):** The structural anchor. Used for primary top navigation, main headings, primary destructive confirmations, high-order navigation states, and baseline data container frames.
- **Secondary (`#0D9488` - Civic Teal):** Active interaction, primary interactive buttons, links, AI data ingestion indicators, and active table selection rows.
- **Tertiary (`#4338CA` - Administrative Indigo):** Reserved for elevated access states, security provenance flags, and administrative role designations.
- **Neutral (`#64748B` - Slate Neutral):** Provides balanced structure across surfaces, dividers, metadata subtitles, and tabular header rules.

### Functional & Semantic Tokens
- **Canvas Base:** `#F8FAFC` (Slate 50) - Low-glare institutional background for multi-hour desktop workflows.
- **Surface Layer 1 (Cards, Tables):** `#FFFFFF` (Pure White).
- **Surface Layer 2 (Sidebars, Well Containers):** `#F1F5F9` (Slate 100).
- **Border Default:** `#E2E8F0` (Slate 200) - 1px crisp separation for tables and cards.
- **Border Strong:** `#CBD5E1` (Slate 300) - Form field borders and active container dividers.
- **Text Primary:** `#0F172A` (Slate 900) - Ratio of 15.8:1 against canvas.
- **Text Secondary:** `#475569` (Slate 600) - Ratio of 7.0:1 against canvas.
- **Text Muted/Disabled:** `#64748B` (Slate 500) - Ratio of 4.6:1 against canvas.

### Role & Access Badges
- **Principal Data Manager:** Background `#EEF2FF`, Text `#3730A3`, Border `#C7D2FE`.
- **Editor:** Background `#F0FDFA`, Text `#115E59`, Border `#99F6E4`.
- **Viewer:** Background `#F1F5F9`, Text `#334155`, Border `#CBD5E1`.

### Data Lifecycle & Validation Statuses
- **Published / Validated:** Background `#F0FDF4`, Text `#166534`, Border `#BBF7D0`.
- **Draft / In Review:** Background `#FFFBEB`, Text `#854D0E`, Border `#FDE68A`.
- **Deprecated / Restricted:** Background `#FEF2F2`, Text `#991B1B`, Border `#FECACA`.

## Typography

Public Sans is selected for its institutional authority, exceptional rendering in high-density data tables, and compliance with federal design standards (USWDS alignment).

### Application Rules
- **Tabular Figures:** All numeric listings, coordinate data, timestamps, and catalog metrics must render using font-variant-numeric: `tabular-nums` to ensure strict vertical alignment across columns.
- **Labels & Micro-Copy:** All `label-sm` tokens must be formatted with uppercase transform and tight optical kerning to distinguish administrative metadata from descriptive content.
- **Hierarchy Enforcement:** Section titles use `headline-md` paired with `body-sm` description labels directly beneath to preserve dense, vertical scan paths.

## Layout & Spacing

The system implements a structured 12-column fluid grid system optimized for data management and spatial-tabular balance.

### Grid & Breakpoints
- **Desktop (>= 1280px):** 12 columns, 1.5rem (`24px`) gutters, 2rem (`32px`) margins. Supports persistent left-hand navigation (280px fixed width), flexible filter canvas, and large data tables. Max width: 1600px.
- **Tablet (768px - 1279px):** 8 columns, 1rem (`16px`) gutters, 1.5rem (`24px`) margins. Sidebar transitions to an off-canvas drawer or collapsible rail (64px icon rail).
- **Mobile (< 768px):** 4 columns, 1rem (`16px`) gutters, 1rem (`16px`) margins. Tables collapse into vertically stacked metadata cards.

### Spacing Philosophy
- Density is prioritized for review panes: form field stacks use `space-md` gaps, while metadata pairs within rows use `space-xs` and `space-sm`.
- Table cell padding: 8px vertical, 16px horizontal for standard density; 6px vertical for dense audit logs.

## Elevation & Depth

To maximize cognitive efficiency and maintain institutional sobriety, this design system avoids heavy blurred drop shadows and expressive three-dimensional styling. Depth is conveyed strictly through structural 1px borders, subtle surface tone shifts, and functional focus elevations.

- **Flat Surface Hierarchy:**
  - **Base Canvas:** `#F8FAFC`
  - **Panels, Tables, Cards:** `#FFFFFF` surrounded by a `1px solid #E2E8F0` rule.
  - **Nested Sections, Table Headers, Filter Trays:** `#F1F5F9`.
- **Interactive Elevation (Tooltips, Overlays, Floating Action Banners):**
  - Restrained functional shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)`. Border remains active at `1px solid #CBD5E1`.
- **Modals & Slide-out Drawers:**
  - Backing overlay: `#0F172A` at 40% opacity.
  - Modal container: Surface `#FFFFFF`, border `1px solid #CBD5E1`, shadow `0 10px 15px -3px rgba(15, 23, 42, 0.1)`.
- **Focus States:**
  - Clear, accessible dual-ring indicator: `box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #0D9488`. No subtle or hidden focus states.

## Shapes

The roundedness level is strictly set to **1 (Soft)**:
- Standard UI components (buttons, input fields, dropdown triggers, cards, and banners) use a standard `4px` (`0.25rem`) radius.
- Larger modal surfaces, drawer containers, and slide-in panels use `8px` (`0.5rem`).
- Pills and high-curvature radiuses are prohibited for cards, inputs, and interactive buttons to maintain an administrative, utilitarian geometry. 
- Badges and status chips use a compact `4px` corner radius with an inset 1px solid border.

## Components

### Buttons
- **Primary:** Background `#0F2942`, Text `#FFFFFF`, Border: None. Hover: `#1E3A8A`. Active: `#0B1E32`. Focused: Teal focus ring. Height: 36px (compact desktop) or 40px (standard).
- **Secondary / Action:** Background `#0D9488`, Text `#FFFFFF`. Hover: `#0F766E`. Active: `#115E59`.
- **Tertiary / Outline:** Background `#FFFFFF`, Text `#0F2942`, Border: `1px solid #CBD5E1`. Hover: Background `#F1F5F9`.
- **Destructive:** Background `#DC2626`, Text `#FFFFFF`. Hover: `#B91C1C`.

### Form Fields & Inputs
- **Text Inputs, Selects, and Textareas:** Background `#FFFFFF`, 1px solid `#CBD5E1`, corner radius 4px, height 36px (inputs), typography `body-md`.
- **Placeholder:** `#94A3B8`.
- **Error State:** Border `1.5px solid #DC2626`, accompanied by an explicit text message with an error icon below the input.
- **Helper Text:** Typography `body-sm`, color `#475569`.

### Selection Controls
- **Checkboxes & Radios:** Size 16px × 16px. Border `1.5px solid #64748B`. Checked state: Background `#0D9488`, Border `#0D9488`, Checkmark `#FFFFFF`. Focus ring: 2px offset with `#0D9488`.

### Badges & Status Chips
- Height 22px, padding 2px 8px, corner radius 4px, typography `label-sm`.
- **Role Badges:**
  - *Principal Data Manager:* `#EEF2FF` base, `#3730A3` text, `1px solid #C7D2FE`.
  - *Editor:* `#F0FDFA` base, `#115E59` text, `1px solid #99F6E4`.
  - *Viewer:* `#F1F5F9` base, `#334155` text, `1px solid #CBD5E1`.

### Data Tables
- **Container:** Wrapped in `1px solid #E2E8F0`, border-radius 4px, overflow hidden.
- **Header:** Background `#F8FAFC`, height 40px, typography `label-md` in `#475569`, border-bottom `1px solid #CBD5E1`. Sort arrows displayed inline.
- **Row:** Height 44px (standard) or 36px (dense). Hover background `#F8FAFC`. Selected background `#F0FDFA` with a `2px solid #0D9488` left accent border.
- **Divider:** Row borders use `1px solid #F1F5F9`.

### Cards & Panels
- Background `#FFFFFF`, `1px solid #E2E8F0` border, `0.25rem` radius. Padding `1rem` to `1.5rem`.
- Card Header: Separated by a bottom border `1px solid #F1F5F9` when containing operational controls or metadata metrics.

### AI / GovAI Metadata Assist Components
- Banner or badge indicator: Subtle gradient or solid background `#F0FDFA`, border `1px solid #5EEAD4`, text `#0F766E`. Includes an explicit confidence score and an audit verification link.