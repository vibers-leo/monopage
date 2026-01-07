# IMPLEMENATION PLAN: Project Migration & Template Integration

## User Objectives

1.  Migrate `art-way` and `arthyun` projects (found in `public/asset`) into the main `artpage` project.
2.  Template-ize the layouts of these two projects so they can be reused.
3.  Implement specific features: Exhibition Record, Art Shop, Press Release, Portfolio, Admin Functions.
4.  Componentize Admin functions for reuse across artist pages.
5.  Delete original source folders after successful integration.

## Tasks

- [ ] **Phase 1: Analysis & Setup**

  - [x] Analyze directory structure of `art-way` and `arthyun`.
  - [ ] Create necessary directories in `artpage` (`src/components/templates`, `src/actions`, `src/app/(artists)`).
  - [ ] Verify dependency compatibility (Tailwind, Lucide, etc.).

- [ ] **Phase 2: Component Migration (Template Creation)**

  - [ ] Migrate `art-way/components` to `src/components/templates/art-way`.
  - [ ] Migrate `arthyun/components` to `src/components/templates/arthyun`.
  - [ ] Consolidate shared UI components (buttons, inputs) if possible.
  - [ ] Extract Admin components to `src/components/admin`.

- [ ] **Phase 3: Logic Migration**

  - [ ] Copy server actions from `art-way/src/actions` to `src/actions` (handling conflicts).
  - [ ] Copy lib utilities (`src/lib`).
  - [ ] Verify Database Schema needs (SQL files found in source).

- [ ] **Phase 4: Page Implementation**

  - [ ] Recreate `art-way` pages at `src/app/(artists)/art-way`.
  - [ ] Recreate `arthyun` pages at `src/app/(artists)/arthyun`.
  - [ ] Update imports to point to new component locations.
  - [ ] Implement/Update Main Admin Page at `src/app/admin`.

- [ ] **Phase 5: Cleanup**
  - [ ] Verify the new pages work (build/compile check).
  - [ ] Delete `public/asset/art-way` and `public/asset/arthyun`.
