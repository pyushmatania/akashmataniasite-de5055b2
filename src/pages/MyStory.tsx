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

const stagger = (i: number) => ({ animationDelay: `${i * 0.1}s` });

const MyStory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-8 hover:bg-muted transition-colors animate-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={stagger(0)}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <h1
          className="text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-10 animate-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={stagger(1)}
        >
          My story
        </h1>

        <p
          className="text-muted-foreground text-lg mb-8 animate-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={stagger(2)}
        >
          Engineering <span className="mx-1">→</span> Product{" "}
          <span className="mx-1">→</span> Web3{" "}
          <span className="mx-1">→</span> AI
        </p>

        <p
          className="text-muted-foreground text-lg leading-relaxed mb-16 animate-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={stagger(3)}
        >
          I started in computer science engineering, moved into product
          management across fintech, edtech, and Web3, and somewhere along the
          way fell in love with building products from 0 to 1. Now I sit at the
          intersection of product thinking and emerging technology — scaling
          platforms to 5,000+ users, achieving product-market fit, and driving
          teams to ship faster.
        </p>

        <p
          className="text-foreground text-2xl md:text-[1.7rem] font-bold leading-snug mb-16 animate-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={stagger(4)}
        >
          I believe the best products happen when craft meets curiosity. I care
          about the details that most people won't notice but everyone will feel
          — the clarity of a user flow, the precision of a roadmap, the moment
          a feature earns its place.
        </p>

        <p
          className="text-muted-foreground text-lg leading-relaxed mb-16 animate-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={stagger(5)}
        >
          I build with AI the way a photographer works with light — it's a
          medium, not a shortcut. The taste, the decisions, the product
          direction? That's still very human. That's still mine.
        </p>

        <div
          className="relative p-1.5 rounded-2xl mb-16 animate-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={{
            ...stagger(6),
            background: "linear-gradient(135deg, hsl(145,63%,49%), hsl(43,96%,56%), hsl(0,78%,62%), hsl(280,70%,55%), hsl(200,80%,55%))",
            boxShadow: "0 8px 32px -8px hsla(280,70%,55%,0.35), 0 4px 16px -4px hsla(0,78%,62%,0.25)",
          }}
        >
          <div className="rounded-xl overflow-hidden bg-background">
            <img
              src={akashPhoto}
              alt="Akash Matania"
              className="w-full aspect-[4/3] object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        <div
          className="flex flex-wrap gap-3 pb-16 animate-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={stagger(7)}
        >
          {skills.map((skill, i) => (
            <span
              key={skill.label}
              className="px-5 py-2.5 rounded-full text-sm font-bold tracking-wide text-white animate-scale-in opacity-0 [animation-fill-mode:forwards] active:scale-95 transition-transform"
              style={{ backgroundColor: skill.color, animationDelay: `${0.7 + i * 0.06}s` }}
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
