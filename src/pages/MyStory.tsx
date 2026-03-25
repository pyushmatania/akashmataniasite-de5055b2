import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const skills = [
  { label: "BRAND IDENTITY", color: "hsl(145, 63%, 49%)" },
  { label: "PACKAGING SYSTEMS", color: "hsl(43, 96%, 56%)" },
  { label: "WEB DESIGN & DEV", color: "hsl(0, 85%, 60%)" },
  { label: "DESIGN SYSTEMS", color: "hsl(43, 96%, 56%)" },
  { label: "TYPOGRAPHY", color: "hsl(145, 63%, 49%)" },
  { label: "AI-ASSISTED DEVELOPMENT", color: "hsl(0, 85%, 60%)" },
];

const MyStory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-8 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-10">
          My story
        </h1>

        {/* Journey Path */}
        <p className="text-muted-foreground text-lg mb-8">
          Architecture{" "}
          <span className="mx-1">→</span> Brand{" "}
          <span className="mx-1">→</span> Web{" "}
          <span className="mx-1">→</span> AI
        </p>

        {/* Bio Paragraph */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-16">
          I started in architecture, moved into brand and packaging design, and
          somewhere along the way fell in love with building for the screen. Now
          I sit at the intersection of design thinking and emerging technology —
          making things that feel considered, from the first sketch to the final
          pixel.
        </p>

        {/* Bold Quote */}
        <p className="text-foreground text-2xl md:text-[1.7rem] font-bold leading-snug mb-16">
          I believe the best work happens when craft meets curiosity. I care
          about the details that most people won't notice but everyone will feel
          — the weight of a typeface, the rhythm of a layout, the moment an
          interaction earns a smile.
        </p>

        {/* AI Philosophy */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-16">
          I build with AI the way a photographer works with light — it's a
          medium, not a shortcut. The taste, the decisions, the creative
          direction? That's still very human. That's still mine.
        </p>

        {/* Photo */}
        <div className="rounded-2xl overflow-hidden mb-16">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
            alt="Designer at workspace"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-3 mb-16">
          {skills.map((skill) => (
            <span
              key={skill.label}
              className="px-5 py-2.5 rounded-full text-sm font-bold tracking-wide text-white"
              style={{ backgroundColor: skill.color }}
            >
              {skill.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyStory;
