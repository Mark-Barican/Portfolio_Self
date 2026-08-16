import type { Metadata } from "next";
import { LegalPage, type Clause } from "@/components/legal/LegalPage";
import { LEGAL_UPDATED, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply when you use ${SITE.shortName}'s portfolio site.`,
  alternates: { canonical: "/terms" },
};

/**
 * Scoped to what this site actually is: a portfolio that shows work and offers
 * a way to get in touch. It sells nothing and has no accounts, so there is no
 * billing, subscription or termination clause.
 */
const CLAUSES: Clause[] = [
  {
    heading: "What this site is",
    body: (
      <p>
        {SITE.url.replace(/^https?:\/\//, "")} is the personal portfolio of{" "}
        {SITE.name}, a full-stack developer based in {SITE.location}. It is
        informational. It does not sell anything, it has no accounts, and
        nothing on it is an offer capable of acceptance.
      </p>
    ),
  },
  {
    heading: "Ownership of this site",
    body: (
      <p>
        The design, copy, layout, animation and source code of this site are
        mine. You are welcome to view the source, learn from it and take ideas
        from it. Please do not republish the site wholesale or present it as
        your own work.
      </p>
    ),
  },
  {
    heading: "Client work shown here",
    body: (
      <>
        <p>
          The projects in the work section were built for real clients and
          organisations. Their names, logos, screenshots and trademarks belong
          to them, and appear here to describe what I built, not to imply any
          ongoing relationship or endorsement.
        </p>
        <p>
          Where a project is a client demo rather than a live product, it is
          labelled as such.
        </p>
      </>
    ),
  },
  {
    heading: "Using the contact form",
    body: (
      <>
        <p>
          The form is for genuine enquiries. Do not use it to send unsolicited
          marketing, automated submissions, malicious content or anything
          unlawful. Rate limits are in place and abusive traffic may be blocked.
        </p>
        <p>
          Sending a message does not create any obligation on my part to reply,
          to take on work, or to keep the contents confidential unless we have
          separately agreed to that in writing. Please do not send confidential
          material through this form.
        </p>
      </>
    ),
  },
  {
    heading: "Accuracy",
    body: (
      <p>
        I keep the work, the stack and the figures on this site current and
        honest, but it is a portfolio rather than a specification. Details can
        go out of date. Nothing here is professional advice, and nothing here
        should be relied on as the basis for a decision without talking to me
        first.
      </p>
    ),
  },
  {
    heading: "External links",
    body: (
      <p>
        This site links to GitHub, LinkedIn, client sites and other destinations
        I do not control. Those links are not endorsements, and I am not
        responsible for the content, availability or practices of anything on
        the other side of them.
      </p>
    ),
  },
  {
    heading: "Availability and liability",
    body: (
      <>
        <p>
          The site is provided as it is, without warranty of any kind. I do not
          guarantee that it will be available, uninterrupted or free of errors.
        </p>
        <p>
          To the fullest extent the law allows, I am not liable for any loss or
          damage arising from your use of this site. Nothing in these terms
          limits liability that cannot lawfully be limited.
        </p>
      </>
    ),
  },
  {
    heading: "Privacy",
    body: (
      <p>
        How information you send is handled is set out separately in the privacy
        policy, which forms part of these terms.
      </p>
    ),
  },
  {
    heading: "Changes and governing law",
    body: (
      <p>
        These terms may change, and the date at the top of this page will show
        when they last did. They are governed by the laws of the Republic of the
        Philippines.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title={
        <>
          Terms of
          <br />
          Service
        </>
      }
      updated={LEGAL_UPDATED}
      intro="This site exists to show my work and to let you start a conversation about yours. Using it means accepting the short set of terms below. Nothing here creates a contract for any actual project, which is always agreed separately in writing."
      clauses={CLAUSES}
    />
  );
}
