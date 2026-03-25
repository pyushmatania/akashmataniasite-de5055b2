import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import akashPhoto from "@/assets/akash-photo.jpeg";

const skills = [
  { label: "PRODUCT STRATEGY", color: "hsl(145, 63%, 49%)" },
  { label: "USER RESEARCH", color: "hsl(43, 96%, 56%)" },
  { label: "WEB3 & FINTECH", color: "hsl(0, 78%, 62%)" },
  { label: "GROWTH & ANALYTICS", color: "hsl(43, 96%, 56%)" },
  { label: "TECHNICAL PRDs", color: "hsl(145, 63%, 49%)" },
  { label: "AI-ASSISTED DEVELOPMENT", color: "hsl(0, 78%, 62%)" },
];

const MyStory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
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
          Engineering{" "}
          <span className="mx-1">→</span> Product{" "}
          <span className="mx-1">→</span> Web3{" "}
          <span className="mx-1">→</span> AI
        </p>

        {/* Bio */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-16">
          I started in computer science engineering, moved into product
          management across fintech, edtech, and Web3, and somewhere along the
          way fell in love with building products from 0 to 1. Now I sit at the
          intersection of product thinking and emerging technology — scaling
          platforms to 5,000+ users, achieving product-market fit, and driving
          teams to ship faster.
        </p>

        {/* Bold Quote */}
        <p className="text-foreground text-2xl md:text-[1.7rem] font-bold leading-snug mb-16">
          I believe the best products happen when craft meets curiosity. I care
          about the details that most people won't notice but everyone will feel
          — the clarity of a user flow, the precision of a roadmap, the moment
          a feature earns its place.
        </p>

        {/* AI Philosophy */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-16">
          I build with AI the way a photographer works with light — it's a
          medium, not a shortcut. The taste, the decisions, the product
          direction? That's still very human. That's still mine.
        </p>

        {/* Photo with colorful gradient frame */}
        <div className="relative p-1.5 rounded-2xl mb-16" style={{
          background: "linear-gradient(135deg, hsl(145,63%,49%), hsl(43,96%,56%), hsl(0,78%,62%), hsl(280,70%,55%), hsl(200,80%,55%))",
          boxShadow: "0 8px 32px -8px hsla(280,70%,55%,0.35), 0 4px 16px -4px hsla(0,78%,62%,0.25)",
        }}>
          <div className="rounded-xl overflow-hidden bg-background">
            <img
              src={akashPhoto}
              alt="Akash Matania"
              className="w-full aspect-[4/3] object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-3 pb-16">
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
