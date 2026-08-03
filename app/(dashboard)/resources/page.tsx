// ─────────────────────────────────────────────────────────────────────────────
// Resources Page
// ─────────────────────────────────────────────────────────────────────────────
// Downloadable tools and companion files. Everything here is a static asset
// the user keeps on their own device rather than a feature of the app itself.
//
// Currently one entry — the offline player. Grouped as a section so more
// tools can be added without restructuring the page.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import OfflinePlayerCard from "@/components/resources/OfflinePlayerCard";

// ─────── Component ───────────────────────────────────────────────────────────

const ResourcesPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-heading-3 text-foreground">Resources</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Tools and files you can download and keep on your device.
        </p>
      </div>

      {/* Tools */}
      <section className="space-y-3">
        <h2 className="text-eyebrow uppercase text-ink-faint">Tools</h2>
        <OfflinePlayerCard />
      </section>
    </div>
  );
};

export default ResourcesPage;
