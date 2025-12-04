import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const commonFields = {
  title: z.string(),
  description: z.string(),
  meta_title: z.string().optional(),
  date: z.date().optional(),
  image: z.string().optional(),
  draft: z.boolean(),
};

// REMOVED: careerCollection - demo content deleted
// REMOVED: caseCollection - demo content deleted
// REMOVED: changelogCollection - demo content deleted

const ueberUnsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/ueber-uns" }),
  schema: z.object({
    ...commonFields,
    hero: z.object({ title: z.string().optional(), content: z.string() }),
    about: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string(),
      stats: z.array(
        z.object({ title: z.string(), value: z.number(), suffix: z.string() }),
      ),
      trusted: z
        .object({
          title: z.string(),
          partners: z.array(z.string()),
        })
        .optional(),
    }),
    slider: z.array(z.string()),
    why: z.object({
      title: z.string().optional(),
      subtitle: z.string(),
      image: z.string(),
      badge: z.string(),
      reason: z.string(),
      content: z.string(),
      points: z.array(
        z.object({
          title: z.string().optional(),
          icon: z.string(),
          content: z.string(),
        }),
      ),
    }),
    faq: z.object({ title: z.string().optional(), subtitle: z.string() }),
  }),
});

const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    ...commonFields,
    info: z.object({
      title: z.string().optional(),
      content: z.string(),
      contacts: z.array(
        z.object({
          title: z.string().optional(),
          icon: z.string(),
          details_1: z.string(),
          details_2: z.string(),
        }),
      ),
    }),
  }),
});

const faqCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/faq" }),
  schema: z.object({
    ...commonFields,
    content: z.string().optional(),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
});

// REMOVED: featuresCollection - demo content deleted

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    hero: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string(),
      button: z.array(
        z.object({ enable: z.boolean(), label: z.string(), link: z.string() }),
      ),
      customer: z.object({ image: z.array(z.string()), note: z.string() }),
    }),
    usps: z
      .array(z.object({ icon: z.string(), title: z.string() }))
      .optional(),
    feature: z.object({
      title: z.string(),
      subtitle: z.string(),
      features: z.array(
        z.object({
          title: z.string(),
          badge: z.string(),
          content: z.string(),
          description: z.string(),
          image: z.string(),
          button: z.object({
            enable: z.boolean(),
            label: z.string(),
            link: z.string(),
          }),
        }),
      ),
    }),
    offering: z.array(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        image: z.string(),
        image_1: z.string(),
        content: z.string(),
        points: z.array(z.string()),
      }),
    ),
    benefits: z.object({
      title: z.string(),
      subtitle: z.string(),
      points: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
          image: z.string().optional(),
          icon: z.string().optional(),
        }),
      ),
    }),
    plan: z.object({
      title: z.string(),
      subtitle: z.string(),
      plans_labels: z.array(z.string()),
      plans: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          price_prefix: z.string(),
          price_monthly: z.string(),
          price_yearly: z.string(),
          price_suffix: z.object({ one: z.string(), two: z.string() }),
          features: z.array(z.string()),
          button: z.object({
            enable: z.boolean(),
            label: z.string(),
            link: z.string(),
          }),
        }),
      ),
    }),
    customer_references: z
      .object({
        enable: z.boolean().optional(),
        title: z.string().optional(),
        logos: z.array(z.string()),
      })
      .optional(),
    target_audiences: z
      .object({
        title: z.string(),
        subtitle: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            subtitle: z.string(),
            description: z.string(),
            image: z.string(),
            link: z.string(),
            stats: z
              .array(
                z.object({
                  label: z.string(),
                  value: z.string(),
                }),
              )
              .optional(),
          }),
        ),
      })
      .optional(),
    industries: z
      .object({
        enable: z.boolean().optional(),
        title: z.string(),
        subtitle: z.string().optional(),
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string().optional(),
            image: z.string(),
            link: z.string(),
          }),
        ),
      })
      .optional(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    ...commonFields,
    categories: z.array(z.string()).optional(),
    author: z.string().optional(),
    hero: z
      .object({ title: z.string().optional(), content: z.string() })
      .optional(),
  }),
});

// REMOVED: integrationsCollection - demo content deleted

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    ...commonFields,
    update: z.date().optional(),
  }),
});

const pricingCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pricing" }),
  schema: z.object({
    ...commonFields,
    hero: z.object({ title: z.string().optional(), content: z.string() }),
    pricing_tab: z.array(z.string()),
    pricing_card: z.array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        price_prefix: z.string(),
        price_monthly: z.string(),
        price_yearly: z.string(),
        price_suffix: z.object({ one: z.string(), two: z.string() }),
        features: z.array(z.string()),
        button: z.object({
          enable: z.boolean(),
          label: z.string(),
          link: z.string(),
        }),
      }),
    ).optional(),
    pricing_products: z.object({
      chip: z.object({
        plans: z.array(
          z.object({
            title: z.string(),
            badge: z.string().optional(),
            price: z.string().optional(),
            price_note: z.string().optional(),
            price_custom: z.string().optional(),
            description: z.string(),
            features: z.array(z.string()),
            buttons: z.array(
              z.object({
                label: z.string(),
                link: z.string(),
                style: z.string(),
              })
            ),
          })
        ),
      }),
      fingerabdruck: z.object({
        plans: z.array(
          z.object({
            title: z.string(),
            badge: z.string().optional(),
            price: z.string().optional(),
            price_note: z.string().optional(),
            price_custom: z.string().optional(),
            description: z.string(),
            features: z.array(z.string()),
            buttons: z.array(
              z.object({
                label: z.string(),
                link: z.string(),
                style: z.string(),
              })
            ),
          })
        ),
      }),
      gesichtserkennung: z.object({
        plans: z.array(
          z.object({
            title: z.string(),
            badge: z.string().optional(),
            price: z.string().optional(),
            price_note: z.string().optional(),
            price_custom: z.string().optional(),
            description: z.string(),
            features: z.array(z.string()),
            buttons: z.array(
              z.object({
                label: z.string(),
                link: z.string(),
                style: z.string(),
              })
            ),
          })
        ),
      }),
    }).optional(),
    compare: z.object({
      title: z.string().optional(),
      subtitle: z.string(),
      plans: z.array(z.object({ name: z.string() })),
      categories: z.array(
        z.object({
          name: z.string(),
          features: z.array(
            z.object({ name: z.string(), values: z.array(z.boolean()) }),
          ),
        }),
      ),
    }),
    faq: z.object({ title: z.string().optional(), subtitle: z.string() }),
  }),
});

// REMOVED: reviewsCollection - demo content deleted

const sectionsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/sections" }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    content: z.string().optional(),
    testimonials: z
      .array(
        z.object({
          name: z.string(),
          designation: z.string(),
          avatar: z.string(),
          content: z.string(),
          image: z.string().optional(),
        }),
      )
      .optional(),
    reviews: z
      .array(
        z.object({
          customerName: z.string(),
          customerAvatar: z.string(),
          customerDesignation: z.string(),
          review: z.string(),
          time: z.string().optional(),
          rating: z.number().min(1).max(5).optional(),
        }),
      )
      .optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    button: z
      .object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      })
      .optional(),
    // Video testimonial fields
    video_url: z.string().optional(),
    testimonial: z
      .object({
        name: z.string(),
        designation: z.string(),
        company: z.string(),
      })
      .optional(),
    // YouTube embed field
    youtube_embed: z.string().optional(),
    // Referenzen Bento fields
    video: z
      .object({
        url: z.string(),
        poster: z.string().optional(),
        testimonial: z.object({
          name: z.string(),
          designation: z.string(),
          company: z.string(),
          quote: z.string().optional(),
        }),
      })
      .optional(),
    image_card: z
      .object({
        image: z.string(),
        quote: z.string(),
        author: z.string(),
        company: z.string(),
        link: z.string().optional(),
      })
      .optional(),
    cta_card: z
      .object({
        title: z.string(),
        description: z.string().optional(),
        link: z.string(),
        label: z.string(),
      })
      .optional(),
    // Blog Preview Section fields
    source: z
      .object({
        label: z.string(),
        url: z.string().optional(),
      })
      .optional(),
    blog_id: z.string().optional(),
  }),
});

const systemeCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/systeme" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    icon: z.string().optional(), // "chip", "fingerprint", "face"
    // Product badges (e.g., "DSGVO-konform", "Made in Germany")
    badges: z.array(z.string()).optional(),
    // Feature grid for hero section
    feature_grid: z
      .array(
        z.object({
          icon: z.string(), // Emoji
          label: z.string(),
        }),
      )
      .optional(),
    // Trust badges
    trust_badges: z
      .array(
        z.object({
          icon: z.string(), // Emoji
          title: z.string(),
          description: z.string().optional(),
        }),
      )
      .optional(),
    // Detailed features with images
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          image: z.string().optional(),
          icon: z.string().optional(), // Emoji
        }),
      )
      .optional(),
    // Simple benefits list (for backwards compatibility)
    benefits: z.array(z.string()).optional(),
    // Product specifications
    specifications: z
      .object({
        technical: z.array(z.object({ label: z.string(), value: z.string() }))
          .optional(),
        delivery: z.array(z.string()).optional(),
        requirements: z.array(z.string()).optional(),
      })
      .optional(),
    // Product gallery
    gallery: z.array(z.string()).optional(),
    // Testimonial
    testimonial: z
      .object({
        author: z.string(),
        company: z.string(),
        quote: z.string(),
        image: z.string().optional(),
      })
      .optional(),
    // Pricing info
    pricing: z
      .object({
        starting_from: z.string().optional(),
        link: z.string().optional(),
        note: z.string().optional(),
      })
      .optional(),
    // Related FAQs (references to FAQ collection)
    faq_section: z.string().optional(), // e.g., "chip", "fingerabdruck", "gesichtserkennung"
    draft: z.boolean().optional().default(false),
  }),
});

const branchenCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/branchen" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    category: z.enum(["groesse", "taetigkeit"]),
    keywords: z.array(z.string()).optional(),
    stats: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
    testimonial: z
      .object({
        author: z.string(),
        company: z.string(),
        quote: z.string(),
      })
      .optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const videosCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/videos" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    youtube_id: z.string().optional(), // Optional for index pages
    duration: z.string().optional(),
    category: z.string().optional(),
    order: z.number().optional().default(0),
    draft: z.boolean().optional().default(false),
  }),
});

const ressourcenCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/ressourcen" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// Export collections
// Removed: career, case, changelog, features, integrations, reviews (demo content deleted)
export const collections = {
  ueber_uns: ueberUnsCollection,
  contact: contactCollection,
  faq: faqCollection,
  homepage: homepageCollection,
  blog: blogCollection,
  pages: pagesCollection,
  pricing: pricingCollection,
  sections: sectionsCollection,
  systeme: systemeCollection,
  branchen: branchenCollection,
  videos: videosCollection,
  ressourcen: ressourcenCollection,
};
