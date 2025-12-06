
import { db } from "../lib/db";
import { themes, tenants } from "../db/schema";
import { eq, ne } from "drizzle-orm";

async function cleanupThemes() {
    console.log("Starting theme cleanup...");

    // 1. Find Urban Vogue theme
    const urbanVogue = await db.query.themes.findFirst({
        where: eq(themes.slug, "urban-vogue"),
    });

    if (!urbanVogue) {
        console.error("CRITICAL ERROR: 'urban-vogue' theme not found in database! Aborting to prevent data loss.");
        process.exit(1);
    }

    console.log(`Found Urban Vogue theme: ${urbanVogue.id}`);

    // 2. Set all tenants to use Urban Vogue
    console.log("Updating all tenants to use Urban Vogue theme...");
    await db.update(tenants).set({
        activeThemeId: urbanVogue.id
    });

    // 3. Delete other themes
    console.log("Deleting other themes...");
    const result = await db.delete(themes).where(ne(themes.slug, "urban-vogue"));

    console.log("Theme cleanup completed successfully.");
    process.exit(0);
}

cleanupThemes().catch((err) => {
    console.error("Error cleaning up themes:", err);
    process.exit(1);
});
