import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import SeoHead from "@/components/seo/SeoHead";

const NotFoundPage = () => {
  return (
    <section className="section-wrap flex min-h-[60vh] items-center justify-center pt-12 sm:pt-20">
      <SeoHead
        title="404"
        description="Page not found on Nikhil Agrahari Portfolio."
        pathname="/404"
        robots="noindex, follow"
      />

      <div className="card-surface max-w-xl rounded-2xl p-8 text-center">
        <SectionTitle
          mobileCenter={false}
          className="text-center [&>p]:mx-auto"
          eyebrow="404"
          title="Page Not Found"
          description="The page you requested does not exist or has been moved."
        />
        <div className="mt-6">
          <Button to="/">Back to Home</Button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
