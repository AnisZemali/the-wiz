/**
 * Every piece of copy and asset path on the landing page.
 * Edit here — the components stay untouched.
 *
 * Products themselves live in `lib/catalogue.ts`.
 */

import { currency, flagship } from "@/lib/catalogue";
import { assetPath, githubPages } from "@/lib/hosting";

export { formatPrice } from "@/lib/catalogue";

export const site = {
  name: "The Wiz",
  tagline:
    "The books built to help medical, pharmacy and dental students study smarter.",
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || (githubPages ? "https://aniszemali.github.io/the-wiz" : "https://thewiz.example.com"),
  email: "thewiz.dz@gmail.com",
  instagram: "https://instagram.com/thewiz.dz",
  tiktok: "https://tiktok.com/@thewiz.dz",
  instagramHandle: "@thewiz.dz",
  tiktokHandle: "@thewiz.dz",
} as const;

/**
 * Hash entries point at sections of the landing page — `SectionLink` rewrites
 * them to `/#id` when the visitor is on any other route.
 */
export const nav = [
  { label: "Collections", href: "/courses" },
  { label: "Offers", href: "/offers" },
  { label: "Why", href: "#why" },
  { label: "Inside", href: "#inside" },
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  title: "THE WIZ",
  subtitle: site.tagline,
  description: [
    "Premium handwritten summaries.",
    "Clear visual explanations.",
    "Dedicated note pages.",
    "One book per subject, every year.",
  ],
  primaryCta: { label: "Order now", href: "#order" },
  secondaryCta: { label: "Browse all books", href: "/books" },
} as const;

export type Pillar = {
  id: string;
  title: string;
  body: string;
  index: string;
};

export const pillars: Pillar[] = [
  {
    id: "structured",
    index: "01",
    title: "Structured summaries",
    body: "Every chapter has been reorganized into concise, high-yield notes.",
  },
  {
    id: "space",
    index: "02",
    title: "Space to think",
    body: "Every summary is followed by blank note pages for your own additions, corrections, and lecture notes.",
  },
  {
    id: "medical",
    index: "03",
    title: "Built for your year",
    body: "Every edition follows the real curriculum of its own year and specialty — nothing generic, nothing borrowed from another programme.",
  },
];

export const insideFeatures = [
  "High-yield summaries",
  "Clean visual organization",
  "Anatomy diagrams",
  "Physiology notes",
  "Mnemonics",
  "Revision-friendly layouts",
  "Personal note pages",
  "Premium paper quality",
] as const;

/**
 * Placeholder spreads. Drop replacement files at the same paths — the
 * layout is aspect-ratio driven, so any 4:5 / 1:1 image will fit.
 */
export const insideSpreads = [
  {
    src: assetPath("/spreads/spread-01.svg"),
    alt: "Book spread showing a structured chapter summary",
    caption: "Chapter summary — Cardiovascular system",
  },
  {
    src: assetPath("/spreads/spread-02.svg"),
    alt: "Book spread showing an anatomy diagram with labels",
    caption: "Anatomy plate — Labelled diagram",
  },
  {
    src: assetPath("/spreads/spread-03.svg"),
    alt: "Book spread showing dedicated blank note pages",
    caption: "Your pages — Blank, ruled, yours",
  },
] as const;

export const audience = {
  heading: "Perfect if you...",
  items: [
    "are studying medicine, pharmacy or dental medicine",
    "want organized notes",
    "don't want to rewrite lectures",
    "prefer understanding instead of memorizing",
  ],
} as const;

export const testimonials = [
  {
    quote: "The Wiz saved me hours every week.",
    name: "Lina B.",
    detail: "First-year medicine",
  },
  {
    quote: "I finally had one place for everything.",
    name: "Karim M.",
    detail: "First-year medicine",
  },
  {
    quote: "I wish I had this from day one.",
    name: "Sarah D.",
    detail: "Second-year medicine",
  },
] as const;

export const about = {
  quote:
    "Created by a medical student who wanted a book that combined concise summaries with space to build personal understanding.",
  name: "The Wiz",
  role: "Founder — Medical student",
} as const;

export const product = {
  kicker: "Book",
  name: "The Wiz — First Year Medicine",
  edition: "First edition",
  /** Price and page count come from the flagship entry in the catalogue. */
  price: flagship.price ?? 0,
  currency,
  maxQuantity: 10,
  /** Shared by every edition in the series. */
  physical: [
    ["Format", "A4 — 21 × 29.7 cm"],
    ["Paper", "120 gsm, ivory"],
    ["Binding", "Sewn, lay-flat"],
  ] as const,
  shippingNote: "Shipping available nationwide.",
  paymentMethods: ["Visa", "Mastercard", "PayPal", "Bank transfer"] as const,
} as const;

export const faqs = [
  {
    question: "What does the book include?",
    answer:
      "Structured handwritten-style summaries for the subject on the cover, with diagrams, schematics and mnemonics — each chapter followed by dedicated blank pages for your own notes, corrections and lecture additions.",
  },
  {
    question: "Which years and specialties are covered?",
    answer:
      "The series is being written across medicine, pharmacy and dental medicine, year by year and subject by subject. In medicine that means years one to six — the seventh is spent in hospital, so it has no book. One edition ships today and the rest are in preparation; you can browse everything and join the list for any of them.",
  },
  {
    question: "How many pages?",
    answer:
      "It depends on the subject — the first-year medicine edition runs to 320 pages. Every edition is printed on 120 gsm ivory paper and sewn, so it lies completely flat while you write.",
  },
  {
    question: "Is it handwritten?",
    answer:
      "Every summary is written by hand, then reproduced at print quality. You get the clarity of handwriting with the consistency of a printed book.",
  },
  {
    question: "Can it be shipped?",
    answer:
      "Yes. We ship nationwide, protected in rigid packaging. Delivery details are confirmed by email once your order is placed.",
  },
  {
    question: "Will new editions be released?",
    answer:
      "Constantly. New subjects are written and released one at a time, and existing editions are revised with feedback from students. Join the list for the edition you need and we email you the day it is printed — nothing else.",
  },
] as const;

export const series = {
  eyebrow: "The series",
  title: "Written year by year.",
  body: "Each book covers one subject of one year. They are released as they are finished, starting with first-year medicine and working outward through the programme — and beyond medicine into pharmacy and dental medicine.",
  cta: { label: "Browse the catalogue", href: "/books" },
} as const;
