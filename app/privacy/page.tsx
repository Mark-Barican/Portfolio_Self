import type { Metadata } from "next";
import { LegalPage, type Clause } from "@/components/legal/LegalPage";
import { LEGAL_UPDATED, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.shortName}'s portfolio handles the information you send through it.`,
  alternates: { canonical: "/privacy" },
};

/**
 * Written against what this site actually does rather than from a template:
 * one contact form posting to `/api/contact`, which sends the message on with
 * Resend; an in-memory IP rate limit in that route; and a single timestamp in
 * `localStorage` for the form's cooldown. There is no analytics, no tag
 * manager and no cookie of any kind, so the policy says so instead of
 * reserving rights the site does not exercise.
 */
const CLAUSES: Clause[] = [
  {
    heading: "What I collect",
    body: (
      <>
        <p>
          The contact form asks for your name, email address and message. Those
          three fields are the only personal information this site ever asks
          for, and they are only collected when you choose to send something.
        </p>
        <p>
          The form also includes a hidden field that real visitors never see or
          fill in. If it arrives filled, the submission is discarded as
          automated and nothing is sent or stored.
        </p>
      </>
    ),
  },
  {
    heading: "How your message reaches me",
    body: (
      <>
        <p>
          When you submit the form, the three fields are posted to this
          site&apos;s own server and passed to Resend, an email delivery
          service, which delivers them to my inbox. Your email address is set as
          the reply-to address so I can answer you directly.
        </p>
        <p>
          Resend processes the message in order to deliver it. I do not use it
          for marketing, mailing lists or any kind of profiling.
        </p>
      </>
    ),
  },
  {
    heading: "Abuse prevention",
    body: (
      <>
        <p>
          To stop the form being used to flood my inbox, the server keeps a
          short-lived count of recent submissions per IP address. That count
          lives in memory only, covers a ten minute window, and is never written
          to a database or a log file.
        </p>
        <p>
          Your browser also stores a single timestamp of your last submission so
          the form can enforce a one minute pause between messages. It is a
          number, it stays on your device, and it identifies nothing.
        </p>
      </>
    ),
  },
  {
    heading: "Cookies and analytics",
    body: (
      <p>
        This site sets no cookies. It runs no analytics, no advertising pixels,
        no session recording and no fingerprinting. Nothing here follows you to
        any other site.
      </p>
    ),
  },
  {
    heading: "Hosting and logs",
    body: (
      <p>
        The site is served by a hosting provider that, like any web server, may
        record standard request information such as IP address, user agent and
        the page requested. Those logs are the provider&apos;s and are kept for
        operational and security purposes only. I do not analyse them and I
        cannot connect them to anything you send me.
      </p>
    ),
  },
  {
    heading: "How long anything is kept",
    body: (
      <p>
        Messages you send stay in my email inbox for as long as the conversation
        is useful. Ask me to delete one and I will, along with any reply thread
        attached to it.
      </p>
    ),
  },
  {
    heading: "Links to other sites",
    body: (
      <p>
        Project links, GitHub, LinkedIn and the résumé download point away from
        this site. Once you follow one, that destination&apos;s own privacy
        practices apply and this policy no longer covers you.
      </p>
    ),
  },
  {
    heading: "Your choices",
    body: (
      <p>
        You can ask me what I hold about you, ask for a copy, ask for a
        correction or ask for deletion. Email me and I will action it. Since the
        only thing I hold is correspondence you started, there is usually very
        little to discuss.
      </p>
    ),
  },
  {
    heading: "Changes",
    body: (
      <p>
        If this site starts doing something new with data, this page changes
        before that happens, and the date at the top changes with it.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title={
        <>
          Privacy
          <br />
          Policy
        </>
      }
      updated={LEGAL_UPDATED}
      intro="This is a personal portfolio, not a product. It collects as little as it can: the details you type into the contact form, and nothing else. There are no cookies, no analytics and no third-party trackers on any page."
      clauses={CLAUSES}
    />
  );
}
