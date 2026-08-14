import { useCallback, useEffect, useState, useMemo } from "react";
import SeoHead from "@/components/seo/SeoHead";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ConsistencyDashboard from "@/components/home/ConsistencyDashboard";
import SkillsSection from "@/components/home/SkillsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import BlogsSection from "@/components/home/BlogsSection";
import JourneySection from "@/components/home/JourneySection";
import ContactSection from "@/components/home/ContactSection";
import { getProjects } from "@/services/projects.service";
import { getBlogs } from "@/services/blogs.service";
import { getErrorMessage } from "@/services/api";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import {
  createPersonSchema,
  createProfessionalServiceSchema,
  createWebSiteSchema,
} from "@/utils/seo";
import { SITE_PROFILE } from "@/constants/siteData";
import { SIGNATURE_PROJECTS } from "@/data/projectsData";
import { BLOG_POSTS as BLOG_LINKS } from "@/data/blogsData";

const sortBlogsByDate = (blogs = []) =>
  [...blogs].sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

const staticLatestBlogs = sortBlogsByDate(BLOG_LINKS).slice(0, 3);
const staticFeaturedProjects = SIGNATURE_PROJECTS.filter((item) => item.featured);

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState(staticFeaturedProjects);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [latestBlogs, setLatestBlogs] = useState(staticLatestBlogs);
  const [loadingLatestBlog, setLoadingLatestBlog] = useState(false);
  const [latestBlogError, setLatestBlogError] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");


  const handleProjectFilter = useCallback((tab) => {
    setProjectFilter(tab);
  }, []);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await getProjects({ featured: true, limit: 3 });
        if (response?.data?.length > 0) {
          setFeaturedProjects(response.data);
        }
      } catch (error) {
        setProjectError(
          getErrorMessage(error, "Unable to load featured projects now."),
        );
      }
    };

    const loadLatestBlog = async () => {
      try {
        const response = await getBlogs({ limit: 3 });
        const apiBlogs = response.data || [];
        if (apiBlogs.length > 0) {
          const mergedMap = new Map();
          BLOG_LINKS.forEach((staticBlog) => {
            mergedMap.set(staticBlog.slug, staticBlog);
          });
          apiBlogs.forEach((apiBlog) => {
            const staticBlog = BLOG_LINKS.find(
              (item) => item.slug === apiBlog.slug,
            );
            const merged = mergeStaticAndApiContent(staticBlog, apiBlog);
            mergedMap.set(merged.slug || apiBlog.slug || apiBlog._id, merged);
          });
          setLatestBlogs(
            sortBlogsByDate(Array.from(mergedMap.values())).slice(0, 3),
          );
        }
      } catch (error) {
        setLatestBlogs(staticLatestBlogs);
      }
    };

    loadFeatured().catch(() => undefined);
    loadLatestBlog().catch(() => undefined);
  }, []);

  // Memoize derived data to prevent cascading child re-renders
  const mergedFeaturedProjects = useMemo(() => {
    const mergedMap = new Map();
    SIGNATURE_PROJECTS.filter((item) => item.featured).forEach((item) => {
      mergedMap.set(item.slug, item);
    });
    if (featuredProjects.length > 0) {
      featuredProjects.forEach((project) => {
        const staticProject = SIGNATURE_PROJECTS.find(
          (item) => item.slug === project.slug,
        );
        const merged = mergeStaticAndApiContent(staticProject, project);
        mergedMap.set(merged.slug || project.slug || project._id, merged);
      });
    }
    return Array.from(mergedMap.values());
  }, [featuredProjects]);

  const filteredProjects = useMemo(() => {
    return projectFilter === "All"
      ? mergedFeaturedProjects
      : mergedFeaturedProjects.filter((p) => {
          if (projectFilter === "Web Dev") {
            return p.category === "Web Dev" || p.category === "Full Stack" || p.category === "FULL STACK";
          }
          return p.category?.toLowerCase() === projectFilter.toLowerCase();
        });
  }, [mergedFeaturedProjects, projectFilter]);

  const liveDemoCount = useMemo(() => {
    return mergedFeaturedProjects.filter((p) => Boolean(p.liveDemoUrl)).length;
  }, [mergedFeaturedProjects]);

  return (
    <>
      <SeoHead
        title="Nikhil Agrahari | Best Full Stack Developer in Lucknow & Prayagraj"
        description="Nikhil Agrahari is the Best Full Stack Developer & MERN Stack Engineer in Lucknow and Prayagraj, UP. Expert in React, Node.js, AI web application development & secure software engineering."
        pathname="/"
        image={SITE_PROFILE.profileImage}
        imageAlt="Nikhil Agrahari - Best Full Stack Developer in Lucknow & Prayagraj"
        keywords={[
          "best full stack developer in lucknow",
          "best full stack developer in prayagraj",
          "top full stack developer lucknow",
          "top full stack developer prayagraj",
          "full stack developer prayagraj",
          "full stack web developer lucknow",
          "best mern stack developer in lucknow",
          "best mern stack developer in prayagraj",
          "hire full stack developer in lucknow",
          "freelance web developer prayagraj",
          "nikhil agrahari full stack developer",
          "Nikhil BBD Lucknow",
        ]}
        jsonLd={[
          createPersonSchema(),
          createWebSiteSchema(),
          createProfessionalServiceSchema(),
        ]}
      />

      {/* Critical above-fold — render eagerly */}
      <HeroSection />
      <AboutSection />
      <div className="cv-auto">
        <ConsistencyDashboard />
      </div>

      {/* Below-fold sections — cv-auto defers layout+paint until near viewport */}
      <div className="cv-auto">
        <SkillsSection />
      </div>
      <div className="cv-auto">
        <ProjectsSection
          projectFilter={projectFilter}
          setProjectFilter={handleProjectFilter}
          loadingProjects={loadingProjects}
          projectError={projectError}
          filteredProjects={filteredProjects}
          mergedFeaturedProjects={mergedFeaturedProjects}
          liveDemoCount={liveDemoCount}
        />
      </div>
      <div className="cv-auto">
        <BlogsSection
          loadingLatestBlog={loadingLatestBlog}
          latestBlogError={latestBlogError}
          latestBlogs={latestBlogs}
        />
      </div>
      <div className="cv-auto">
        <JourneySection />
      </div>
      <div className="cv-auto">
        <ContactSection />
      </div>
    </>
  );
};

export default HomePage;
