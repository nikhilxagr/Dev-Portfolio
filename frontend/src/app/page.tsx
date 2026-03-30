import { AboutSnapshotSection } from "@/components/home/about-snapshot-section";
import { BlogPreviewSection } from "@/components/home/blog-preview-section";
import { HeroSection } from "@/components/home/hero-section";
import { PracticalsPreviewSection } from "@/components/home/practicals-preview-section";
import { ProjectsPreviewSection } from "@/components/home/projects-preview-section";
import { ServicesPreviewSection } from "@/components/home/services-preview-section";
import {
  getBlogs,
  getPageCopy,
  getPracticals,
  getProjects,
  getServices,
  getSiteContent,
  getStats,
} from "@/lib/content";

export default async function HomePage() {
  const [site, pageCopy, stats, projects, practicals, services, blogs] =
    await Promise.all([
      getSiteContent(),
      getPageCopy(),
      getStats(),
      getProjects(),
      getPracticals(),
      getServices(),
      getBlogs(),
    ]);

  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
  const featuredPracticals = practicals.slice(0, 4);
  const featuredServices = services.slice(0, 3);
  const featuredBlogs = [...blogs.filter((blog) => blog.featured), ...blogs]
    .filter(
      (blog, index, list) =>
        list.findIndex((item) => item.slug === blog.slug) === index,
    )
    .slice(0, 3);

  return (
    <main className="flex-1">
      <HeroSection site={site} stats={stats} />
      <AboutSnapshotSection
        shortIntro={site.shortIntro}
        focusAreas={site.focusAreas}
      />
      <ProjectsPreviewSection
        title={pageCopy.home.projectsTitle ?? "Projects"}
        projects={featuredProjects}
      />
      <PracticalsPreviewSection
        title={pageCopy.home.practicalsTitle ?? "Practicals"}
        practicals={featuredPracticals}
      />
      <ServicesPreviewSection
        title={pageCopy.home.servicesTitle ?? "Services"}
        services={featuredServices}
      />
      <BlogPreviewSection blogs={featuredBlogs} />
    </main>
  );
}
