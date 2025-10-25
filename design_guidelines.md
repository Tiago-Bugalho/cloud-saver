# Design Guidelines: Personal Cloud Drive Application

## Design Approach
**Selected System**: Material Design principles adapted for cloud storage
**Justification**: Utility-focused application requiring clear information hierarchy, efficient file management, and data-dense displays. Drawing inspiration from Google Drive and Dropbox for proven patterns in cloud storage interfaces.

**Core Principles**:
- Clarity over decoration
- Efficient use of space for file listings
- Clear visual feedback for upload/download states
- Intuitive file organization

## Typography

**Font Family**: Inter (Google Fonts) for exceptional readability
- **Headings**: 
  - H1: 2.5rem (40px), font-weight: 700
  - H2: 1.875rem (30px), font-weight: 600
  - H3: 1.5rem (24px), font-weight: 600
- **Body Text**: 1rem (16px), font-weight: 400, line-height: 1.5
- **UI Labels**: 0.875rem (14px), font-weight: 500
- **Captions/Meta**: 0.75rem (12px), font-weight: 400

## Layout System

**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-6, space-y-8
- Grid gaps: gap-4, gap-6
- Consistent use of these values throughout

**Container Strategy**:
- Authentication pages: max-w-md (centered)
- Dashboard: max-w-7xl with full-width file listing area
- Two-column layout for dashboard: Sidebar (w-64) + Main content area (flex-1)

## Page Layouts

### Authentication Pages (Login/Signup)
- Centered card design (max-w-md)
- Single column form layout
- Logo/brand at top
- Form fields with consistent p-4 spacing
- Primary CTA button at bottom
- Link to alternate auth option below
- Subtle elevation with shadow-lg

### Dashboard Layout
**Sidebar** (fixed w-64):
- Logo/brand at top (p-6)
- Navigation items (p-4 each)
- Storage quota widget at bottom
- Items: Upload, My Files, Recent, Trash

**Main Content Area**:
- Header bar: breadcrumb navigation + view toggles (grid/list) + sort options
- File upload dropzone (when empty state or drag-over)
- File listing area with table/grid view options
- Pagination controls at bottom

## Component Library

### File Upload Zone
- Large dropzone area with dashed border (border-2 border-dashed)
- Centered upload icon and text
- "Click to browse" and "or drag files here" messaging
- Active state when dragging files over
- Progress bars for active uploads (h-2 rounded-full)

### File List Views

**Table View** (default):
- Columns: Name | Size | Type | Modified | Actions
- Row height: h-16
- Alternating row backgrounds for scannability
- Checkbox for multi-select (left column)
- File type icons (w-8 h-8)
- Action buttons (download, delete) on hover or always visible on mobile

**Grid View**:
- Card-based layout (grid-cols-2 md:grid-cols-4 lg:grid-cols-6)
- File preview thumbnails or type icons
- File name below
- Size and date in smaller text
- Hover overlay with actions

### Storage Quota Widget
- Horizontal progress bar showing usage
- Text: "X GB of Y GB used"
- Percentage display
- Warning state when >90% used
- Upgrade CTA for premium accounts

### Navigation Items
- Icon + label horizontal layout
- p-4 spacing
- Rounded corners (rounded-lg)
- Active state with background fill
- Hover state subtle background

### Buttons
- Primary: Solid background, px-6 py-3, rounded-lg, font-weight: 600
- Secondary: Outlined variant, same sizing
- Icon buttons: Square (w-10 h-10), rounded-lg, centered icon
- Upload button: Prominent in header with icon

### File Actions Menu
- Dropdown or inline buttons
- Actions: Download, Rename, Move, Delete
- Icon + text for clarity
- Destructive actions (delete) with visual distinction

### Modals/Dialogs
- Centered overlay (max-w-lg)
- Header with title + close button
- Content area with p-6
- Footer with action buttons (right-aligned)
- Shadow-2xl for depth

### Empty States
- Centered content with illustration placeholder
- Primary message (text-xl font-semibold)
- Secondary message explaining action
- CTA button to upload first file

### Upload Progress Indicators
- Individual file progress bars
- File name, size, and percentage
- Cancel upload option
- Success checkmark when complete

## Responsive Behavior

**Mobile** (< 768px):
- Hide sidebar, add hamburger menu
- Stack file cards in single column
- Simplified file list (name + size only)
- Bottom navigation for key actions
- Upload button as FAB (fixed bottom-right)

**Tablet** (768px - 1024px):
- Collapsible sidebar
- Grid view: 3 columns
- Table view with reduced columns

**Desktop** (> 1024px):
- Full sidebar visible
- Grid view: 6 columns
- Complete table view with all columns

## Animations

**Use Sparingly**:
- File upload progress: Smooth progress bar animation
- Drag-and-drop: Subtle scale on dropzone when dragging
- File actions: Gentle fade for dropdown menus
- No page transitions or scroll animations

## Images

**Hero Section**: None (utility application)

**Illustrations**:
- Empty state illustration: Cloud with upload arrow (placeholder comment for custom graphic)
- 404/Error states: Simple icon-based graphics

**File Preview Thumbnails**:
- Image files: Actual thumbnail preview
- Other files: Generic type icons via icon library

## Special Considerations

- Admin account (tiago/4111) shows 100GB quota without visual distinction from regular UI
- Real-time storage calculation as files are uploaded/deleted
- Clear error messaging for quota exceeded scenarios
- File type validation feedback before upload
- Optimistic UI updates for better perceived performance