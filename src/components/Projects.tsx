import { GitFork, ExternalLink } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
}

const projects: Project[] = [
  {
    title: "A Name Against You: Racial Hiring Discrimination",
    description:
      "Replicated Bertrand & Mullainathan (2004) using a resume audit dataset. Built OLS linear probability models with HC1 robust standard errors, tested interaction terms between race and resume quality, and ran a Logit robustness check. Key finding: Black-sounding names faced a 3.2 percentage point lower callback rate — robust across both LPM and Logit specifications. Resume quality did not significantly reduce the racial gap.",
    tags: ["Python", "pandas", "statsmodels", "OLS", "Logit", "econometrics"],
    github: "https://github.com/ddoneu/ECON3916-Statistical-Machine-Learning/blob/main/Project1/Project_1_Phase_2%263%264.ipynb",
  },
  {
    title: "Clustering Economies with World Bank Data",
    description:
      "Applied K-Means clustering to World Bank Development Indicators across ~160 countries using 7 features including GDP per capita, life expectancy, CO2 emissions, and internet usage. Standardized features with StandardScaler, reduced dimensions via PCA for visualization, and used elbow method and silhouette analysis to select optimal K. Compared algorithmic clusters to World Bank official income classifications.",
    tags: ["Python", "scikit-learn", "wbgapi", "K-Means", "PCA", "pandas"],
    github: "https://github.com/ddoneu/ECON3916-Statistical-Machine-Learning/blob/main/Lab22/lab_ch22_guided.ipynb",
  },
  {
    title: "FedSpeak: NLP on FOMC Meeting Minutes",
    description:
      "Built a TF-IDF pipeline on FOMC meeting minutes from the Federal Reserve. Computed Loughran-McDonald financial sentiment scores, visualized hawkish vs. dovish language trends over time, and clustered documents with K-Means on TF-IDF vectors. Analyzed pre- vs. post-2020 shifts in Fed communication tone.",
    tags: ["Python", "scikit-learn", "NLTK", "TF-IDF", "K-Means", "HuggingFace"],
    github: "https://github.com/ddoneu/ECON3916-Statistical-Machine-Learning/blob/main/Lab23/lab_ch23_guided.ipynb",
  },
];

export function Projects() {
  return (
    <section id="projects" style={{ borderTop: "1px solid var(--rule)" }}>
      <div className="max-w-6xl mx-auto px-8 py-24">
        <SectionHeading>Projects</SectionHeading>
        <p
          className="font-sans text-base mt-4 max-w-2xl leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          Data science and economics research spanning causal inference,
          machine learning, and natural language processing.
        </p>

        <div
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3"
          style={{ border: "1px solid var(--rule)" }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="group flex flex-col p-8 transition-all duration-200 relative"
      style={{
        background: "var(--card-bg)",
        borderRight: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#2251FF] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <h3
        className="font-display font-bold leading-snug"
        style={{ fontSize: "1.4rem", color: "var(--heading)" }}
      >
        {project.title}
      </h3>

      <p
        className="font-sans mt-3 text-sm leading-relaxed flex-1"
        style={{ color: "var(--muted)" }}
      >
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-sans text-xs font-medium px-2 py-1"
            style={{
              color: "#2251FF",
              background: "rgba(34,81,255,0.06)",
              border: "1px solid rgba(34,81,255,0.15)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#2251FF] hover:bg-[#1840e0] transition-colors duration-150 rounded-[2px]"
            style={{ padding: "0.45rem 1rem" }}
          >
            <GitFork size={12} />
            GitHub
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans inline-flex items-center gap-1.5 text-xs font-semibold rounded-[2px] hover:text-white hover:bg-[#2251FF] transition-colors duration-150"
            style={{
              padding: "0.45rem 1rem",
              color: "#2251FF",
              border: "1px solid #2251FF",
            }}
          >
            <ExternalLink size={12} />
            Live
          </a>
        )}
      </div>
    </article>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="w-10 h-0.5 bg-[#2251FF] mb-4" />
      <h2
        className="font-display font-bold tracking-tight"
        style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--heading)" }}
      >
        {children}
      </h2>
    </div>
  );
}
