import { Card, Heading, Text, Button, Tag, Screen } from '8bit-ui';
import { siteConfig } from '@/lib/site-config';

const heroSignals = [
  { title: 'Theme Tokens', detail: 'Light and dark palettes with pixel-first contrast.' },
  { title: 'Typed Components', detail: 'Composable primitives built for React + TypeScript.' },
  { title: 'Fast Start', detail: 'Install once, then style complete pages in minutes.' },
] as const;

const featureCards = [
  {
    title: 'Pixel Geometry, Modern Layouts',
    description:
      'Notched corners, hard borders, and CRT-style texture layered into flexible grid systems that scale from landing pages to app dashboards.',
    tag: 'Layout',
    color: 'primary' as const,
  },
  {
    title: 'Accessible Focus States',
    description:
      'Interactive elements keep bold arcade personality while remaining keyboard-visible, high-contrast, and predictable for real users.',
    tag: 'A11y',
    color: 'success' as const,
  },
  {
    title: 'Brandable Without Losing Vibe',
    description:
      'Swap palette tokens and content voice while retaining the retro pixel identity teams expect from your product.',
    tag: 'Brand',
    color: 'secondary' as const,
  },
  {
    title: 'Docs + Components Together',
    description:
      'Marketing pages and documentation share the same visual language, reducing duplicated UI work and design drift.',
    tag: 'Workflow',
    color: 'warning' as const,
  },
] as const;

const adoptionReasons = [
  'Design once with reusable primitives instead of one-off homepage CSS experiments.',
  'Keep the nostalgic look while shipping performance-conscious React components.',
  'Create stronger visual hierarchy with modern section pacing and readable typography.',
  'Scale from a single splash page to complete product documentation.'
] as const;

export default function HomePage() {
  return (
    <div className="homeStack">
      <section className="homeHero" aria-labelledby="home-hero-title">
        <Screen
          mode="inline"
          grid={false}
          scanlines={false}
          vignette={false}
          className="homeHeroScreen"
          backgroundClassName="homeHeroBackground"
        >
          <div className="homeHeroContent">
            <div className="homeHeroPanel">
              <Heading level={1} id="home-hero-title" className="homeTitle">
                Build A Modern Website With Pixel Character
              </Heading>
              <Text size="lg" className="homeLead">
                8bit-ui gives you polished React components that feel nostalgic, read clearly, and look launch-ready on modern screens.
              </Text>

              <div className="commandPrompt" aria-label="Install command">
                <span className="promptChar" aria-hidden>
                  &gt;
                </span>
                <code>npm install 8bit-ui</code>
              </div>

              <div className="ctaRow">
                <Button href="/docs/" color="primary" className="homeActionButton">
                  Explore Docs
                </Button>
                <Button
                  href={siteConfig.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  color="secondary"
                  className="homeActionButton"
                >
                  View GitHub
                </Button>
              </div>
            </div>

            <ul className="homeSignalList" aria-label="Core strengths">
              {heroSignals.map((signal) => (
                <li key={signal.title} className="homeSignalItem">
                  <Text as="span" className="homeSignalTitle" weight="bold">
                    {signal.title}
                  </Text>
                  <Text as="span" className="homeSignalDetail">
                    {signal.detail}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </Screen>
        <div className="homeHeroTransition" />
      </section>
      <section className="homeSection" aria-labelledby="home-features-title">
        <div className="homeSectionHeader">
          <Heading level={2} id="home-features-title" className="homeSectionTitle">
            Made For Teams Shipping Real Products
          </Heading>
          <Text className="homeSectionLead homeBodyText">
            Bring a retro visual identity to your brand without sacrificing readability, responsiveness, or development velocity.
          </Text>
        </div>

        <div className="homeFeatureGrid">
          {featureCards.map((feature) => (
            <Card
              key={feature.title}
              className="homeFeatureCard"
              title={<span className="homeCardTitle">{feature.title}</span>}
            >
              <div className="homeFeatureMeta">
                <Tag label={feature.tag} color={feature.color} size="sm" />
              </div>
              <Text className="homeBodyText">{feature.description}</Text>
            </Card>
          ))}
        </div>
      </section>
      <section className="homeSection homeShowcaseSection" aria-labelledby="home-showcase-title">
        <div className="homeShowcaseGrid">
          <Card title={<span className="homeCardTitle">Component Preview</span>} className="homeShowcaseCard">
            <div className="homePreviewWindow" aria-hidden>
              <div className="homePreviewBar">
                <span />
                <span />
                <span />
              </div>
              <div className="homePreviewBody">
                <Heading level={3} className="homePreviewTitle homeReadableHeading">
                  Quest Tracker
                </Heading>
                <Text className="homePreviewText homeBodyText">
                  Ship UI that feels handcrafted without rebuilding primitives on every screen.
                </Text>
                <div className="homePreviewTags">
                  <Tag label="Retro" size="sm" color="primary" />
                  <Tag label="Fast" size="sm" color="success" />
                  <Tag label="Typed" size="sm" color="secondary" />
                </div>
                <div className="homePreviewActions">
                  <Button type="button" color="primary">
                    Start Build
                  </Button>
                  <Button type="button" variant="outline" color="primary">
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card title={<span className="homeCardTitle">Why Teams Choose 8bit-ui</span>} className="homeShowcaseCard">
            <Heading level={2} id="home-showcase-title" className="homeShowcaseTitle homeReadableHeading">
              Nostalgia In Style, Professional In Execution
            </Heading>
            <ul className="homeReasonList">
              {adoptionReasons.map((reason) => (
                <li key={reason}>
                  <Text className="homeBodyText">{reason}</Text>
                </li>
              ))}
            </ul>

            <div className="homeMiniCode" aria-label="Example import snippet">
              <code>{"import { Button, Card, Tag } from '8bit-ui';"}</code>
            </div>
          </Card>
        </div>
      </section>
      <section className="homeFinalCtaSection" aria-labelledby="home-final-cta-title">
        <Card className="homeFinalCtaCard">
          <div className="homeFinalCta">
            <Tag label="Ready to launch" color="success" className="homeFinalTag" />
            <Heading level={2} id="home-final-cta-title" className="homeFinalTitle homeReadableHeading">
              Design Your Retro Frontend Like A Modern Product Team
            </Heading>
            <Text className="homeFinalLead homeBodyText">
              Build your homepage, docs, and app UI with one consistent pixel-inspired system.
            </Text>
            <div className="ctaRow ctaRowFinal">
              <Button href="/docs/" color="primary" className="homeActionButton">
                Start In Docs
              </Button>
              <Button
                href={siteConfig.repoUrl}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                color="primary"
                className="homeActionButton"
              >
                Review Source
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
