import type { Config } from "@puckeditor/core";

import { Header } from "./components/header/header";
import { headerConfig } from "./components/header/header.puck";
import { HeroSection } from "./components/hero-section/hero-section";
import { heroSectionConfig } from "./components/hero-section/hero-section.puck";
import { FeaturesGrid } from "./components/features-grid/features-grid";
import { featuresGridConfig } from "./components/features-grid/features-grid.puck";
import { ResearchShowcase } from "./components/research-showcase/research-showcase";
import { researchShowcaseConfig } from "./components/research-showcase/research-showcase.puck";
import { AboutSection } from "./components/about-section/about-section";
import { aboutSectionConfig } from "./components/about-section/about-section.puck";
import { ServicesGrid } from "./components/services-grid/services-grid";
import { servicesGridConfig } from "./components/services-grid/services-grid.puck";
import { TestimonialsSection } from "./components/testimonials-section/testimonials-section";
import { testimonialsSectionConfig } from "./components/testimonials-section/testimonials-section.puck";
import { PricingTable } from "./components/pricing-table/pricing-table";
import { pricingTableConfig } from "./components/pricing-table/pricing-table.puck";
import { FAQSection } from "./components/faq-section/faq-section";
import { faqSectionConfig } from "./components/faq-section/faq-section.puck";
import { ContactForm } from "./components/contact-form/contact-form";
import { contactFormConfig } from "./components/contact-form/contact-form.puck";
import { CtaSection } from "./components/cta-section/cta-section";
import { ctaSectionConfig } from "./components/cta-section/cta-section.puck";
import { StatsCounter } from "./components/stats-counter/stats-counter";
import { statsCounterConfig } from "./components/stats-counter/stats-counter.puck";
import { BlogSection } from "./components/blog-section/blog-section";
import { blogSectionConfig } from "./components/blog-section/blog-section.puck";
import { GallerySection } from "./components/gallery-section/gallery-section";
import { gallerySectionConfig } from "./components/gallery-section/gallery-section.puck";
import { Footer } from "./components/footer/footer";
import { footerConfig } from "./components/footer/footer.puck";
import { LogoCloud } from "./components/logo-cloud/logo-cloud";
import { logoCloudConfig } from "./components/logo-cloud/logo-cloud.puck";
import { Spacer } from "./components/spacer/spacer";
import { spacerConfig } from "./components/spacer/spacer.puck";
import { TimelineSection } from "./components/timeline-section/timeline-section";
import { timelineSectionConfig } from "./components/timeline-section/timeline-section.puck";
import { CommunityChallengeLedger } from "./components/community-challenge-ledger/community-challenge-ledger";
import { communityChallengeLedgerConfig } from "./components/community-challenge-ledger/community-challenge-ledger.puck";
import { AudienceRouter } from "./components/audience-router/audience-router";
import { audienceRouterConfig } from "./components/audience-router/audience-router.puck";
import { CollaborationIntake } from "./components/collaboration-intake/collaboration-intake";
import { collaborationIntakeConfig } from "./components/collaboration-intake/collaboration-intake.puck";
import { RecognitionLedger } from "./components/recognition-ledger/recognition-ledger";
import { recognitionLedgerConfig } from "./components/recognition-ledger/recognition-ledger.puck";
import { WalletProofBlock } from "./components/wallet-proof/wallet-proof";
import { walletProofConfig } from "./components/wallet-proof/wallet-proof.puck";
import { BlogDirectory } from "./components/blog-directory/blog-directory";
import { blogDirectoryConfig } from "./components/blog-directory/blog-directory.puck";

// Puck wraps component props with {id, puck} — cast to satisfy strict typing
// while keeping runtime behavior correct (Puck passes all declared fields)
const r = (fn: Function) => fn as any;

export function createPuckConfig(): Config {
  return {
    categories: {
      layout: {
        title: "Layout",
        components: ["Header", "Footer", "Spacer"],
      },
      hero: {
        title: "Hero",
        components: ["HeroSection"],
      },
      content: {
        title: "Content",
        components: [
          "FeaturesGrid",
          "ResearchShowcase",
          "AboutSection",
          "ServicesGrid",
          "FAQSection",
          "BlogSection",
          "TimelineSection",
          "CommunityChallengeLedger",
          "AudienceRouter",
          "RecognitionLedger",
          "WalletProof",
          "BlogDirectory",
        ],
      },
      social: {
        title: "Social Proof",
        components: ["TestimonialsSection", "StatsCounter", "LogoCloud"],
      },
      conversion: {
        title: "Conversion",
        components: ["CTASection", "PricingTable", "ContactForm", "CollaborationIntake"],
      },
      media: {
        title: "Media",
        components: ["GallerySection"],
      },
    },
    components: {
      Header: {
        ...headerConfig,
        render: r(Header),
      },
      HeroSection: {
        ...heroSectionConfig,
        render: r(HeroSection),
      },
      FeaturesGrid: {
        ...featuresGridConfig,
        render: r(FeaturesGrid),
      },
      ResearchShowcase: {
        ...researchShowcaseConfig,
        render: r(ResearchShowcase),
      },
      AboutSection: {
        ...aboutSectionConfig,
        render: r(AboutSection),
      },
      ServicesGrid: {
        ...servicesGridConfig,
        render: r(ServicesGrid),
      },
      TestimonialsSection: {
        ...testimonialsSectionConfig,
        render: r(TestimonialsSection),
      },
      PricingTable: {
        ...pricingTableConfig,
        render: r(PricingTable),
      },
      FAQSection: {
        ...faqSectionConfig,
        render: r(FAQSection),
      },
      ContactForm: {
        ...contactFormConfig,
        render: r(ContactForm),
      },
      CTASection: {
        ...ctaSectionConfig,
        render: r(CtaSection),
      },
      StatsCounter: {
        ...statsCounterConfig,
        render: r(StatsCounter),
      },
      BlogSection: {
        ...blogSectionConfig,
        render: r(BlogSection),
      },
      GallerySection: {
        ...gallerySectionConfig,
        render: r(GallerySection),
      },
      Footer: {
        ...footerConfig,
        render: r(Footer),
      },
      LogoCloud: {
        ...logoCloudConfig,
        render: r(LogoCloud),
      },
      Spacer: {
        ...spacerConfig,
        render: r(Spacer),
      },
      TimelineSection: {
        ...timelineSectionConfig,
        render: r(TimelineSection),
      },
      CommunityChallengeLedger: {
        ...communityChallengeLedgerConfig,
        render: r(CommunityChallengeLedger),
      },
      AudienceRouter: { ...audienceRouterConfig, render: r(AudienceRouter) },
      CollaborationIntake: { ...collaborationIntakeConfig, render: r(CollaborationIntake) },
      RecognitionLedger: { ...recognitionLedgerConfig, render: r(RecognitionLedger) },
      WalletProof: { ...walletProofConfig, render: r(WalletProofBlock) },
      BlogDirectory: { ...blogDirectoryConfig, render: r(BlogDirectory) },
    },
  };
}
