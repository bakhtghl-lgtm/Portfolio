import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ProfileCard } from "@/components/ProfileCard";
import { SideNav } from "@/components/SideNav";
import { BackToTop } from "@/components/BackToTop";
import { Intro } from "@/components/sections/Intro";
import { About } from "@/components/sections/About";
import { Resume } from "@/components/sections/Resume";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonial } from "@/components/sections/Testimonial";
import { Contact } from "@/components/sections/Contact";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen px-4 md:px-8 py-6 md:py-8">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[380px_1fr] gap-8">
        <div className="lg:sticky lg:top-8 lg:self-start lg:h-[calc(100vh-4rem)]">
          <ProfileCard />
        </div>
        <main className="lg:pr-20">
          <Intro />
          <About />
          <Resume />
          <Services />
          <Skills />
          <Portfolio />
          <Testimonial />
          <Contact />
        </main>
      </div>
      <SideNav />
      <BackToTop />
      <Toaster />
    </div>
  );
}
