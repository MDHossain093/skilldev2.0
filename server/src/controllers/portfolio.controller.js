import prisma from "../config/db.js";

// Reserved username slugs that conflict with future app routes.
const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "login",
  "register",
  "dashboard",
  "profile",
  "skills",
  "projects",
  "search",
  "developers",
  "team-match",
  "ai-mentor",
  "portfolio",
  "p",
  "settings",
  "public",
]);

const USERNAME_RE = /^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/;

const slugify = (value) => {
  if (typeof value !== "string") return null;
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
};

const ensureOwner = (req, res) => {
  const { userId } = req.params;
  if (userId !== req.user.id) {
    res.status(403).json({ message: "Forbidden" });
    return false;
  }
  return true;
};

// GET /api/portfolio/:userId  — owner view
export const getMyPortfolio = async (req, res) => {
  if (!ensureOwner(req, res)) return;
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id },
    });
    return res.json({ portfolio });
  } catch (err) {
    console.error("getMyPortfolio:", err);
    return res.status(500).json({ message: "Failed to load portfolio" });
  }
};

// PUT /api/portfolio/:userId  — create or update
export const upsertPortfolio = async (req, res) => {
  if (!ensureOwner(req, res)) return;
  const { username, headline, about, template, theme } = req.body || {};

  const data = {};
  if (typeof headline !== "undefined") data.headline = headline || null;
  if (typeof about !== "undefined") data.about = about || null;
  if (typeof template !== "undefined") data.template = template || "modern";
  if (typeof theme !== "undefined") data.theme = theme || "dark";

  // username requires validation because it is part of the public URL.
  if (typeof username !== "undefined" && username !== null) {
    const candidate = slugify(username);
    if (!candidate || !USERNAME_RE.test(candidate)) {
      return res.status(400).json({
        message:
          "Username must be 3-30 chars, lowercase letters, numbers, _ or -",
      });
    }
    if (RESERVED_USERNAMES.has(candidate)) {
      return res.status(400).json({ message: "That username is reserved" });
    }

    // ensure no OTHER portfolio already owns this username
    const clash = await prisma.portfolio.findFirst({
      where: { username: candidate, NOT: { userId: req.user.id } },
      select: { id: true },
    });
    if (clash) {
      return res.status(409).json({ message: "Username already taken" });
    }
    data.username = candidate;
  }

  try {
    const portfolio = await prisma.portfolio.upsert({
      where: { userId: req.user.id },
      update: data,
      create: {
        userId: req.user.id,
        username:
          data.username || slugify(req.user.name) || `user-${req.user.id.slice(-6)}`,
        ...data,
      },
    });
    return res.json({ portfolio });
  } catch (err) {
    if (err?.code === "P2002") {
      return res.status(409).json({ message: "Username already taken" });
    }
    console.error("upsertPortfolio:", err);
    return res.status(500).json({ message: "Failed to save portfolio" });
  }
};

// PATCH /api/portfolio/:userId/toggles  — visibility toggles
export const updateToggles = async (req, res) => {
  if (!ensureOwner(req, res)) return;
  const { showAbout, showSkills, showProjects } = req.body || {};
  const data = {};
  if (typeof showAbout === "boolean") data.showAbout = showAbout;
  if (typeof showSkills === "boolean") data.showSkills = showSkills;
  if (typeof showProjects === "boolean") data.showProjects = showProjects;

  try {
    const existing = await prisma.portfolio.findUnique({
      where: { userId: req.user.id },
    });
    const portfolio = existing
      ? await prisma.portfolio.update({ where: { userId: req.user.id }, data })
      : await prisma.portfolio.create({
          data: {
            userId: req.user.id,
            username: slugify(req.user.name) || `user-${req.user.id.slice(-6)}`,
            ...data,
          },
        });
    return res.json({ portfolio });
  } catch (err) {
    console.error("updateToggles:", err);
    return res.status(500).json({ message: "Failed to update toggles" });
  }
};

// POST /api/portfolio/:userId/publish  — flip isPublished
export const setPublish = async (req, res) => {
  if (!ensureOwner(req, res)) return;
  const { isPublished } = req.body || {};
  if (typeof isPublished !== "boolean") {
    return res.status(400).json({ message: "isPublished must be boolean" });
  }
  try {
    const existing = await prisma.portfolio.findUnique({
      where: { userId: req.user.id },
    });
    const portfolio = existing
      ? await prisma.portfolio.update({
          where: { userId: req.user.id },
          data: { isPublished },
        })
      : await prisma.portfolio.create({
          data: {
            userId: req.user.id,
            username: slugify(req.user.name) || `user-${req.user.id.slice(-6)}`,
            isPublished,
          },
        });
    return res.json({ portfolio });
  } catch (err) {
    console.error("setPublish:", err);
    return res.status(500).json({ message: "Failed to publish" });
  }
};

// GET /api/portfolio/public/:username  — fully public; joins live data
export const getPublicPortfolio = async (req, res) => {
  const { username } = req.params;
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { username },
    });
    if (!portfolio || !portfolio.isPublished) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const [user, profile, skills, projects] = await Promise.all([
      prisma.user.findUnique({
        where: { id: portfolio.userId },
        select: { id: true, name: true, email: false },
      }),
      prisma.profile.findUnique({
        where: { userId: portfolio.userId },
        select: {
          bio: true,
          github: true,
          linkedin: true,
          image: true,
          location: true,
        },
      }),
      prisma.userSkill.findMany({
        where: { user: { id: portfolio.userId } },
        select: { skill: { select: { id: true, name: true } } },
        orderBy: { skill: { name: "asc" } },
      }),
      prisma.project.findMany({
        where: { userId: portfolio.userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          githubUrl: true,
          liveUrl: true,
          techStack: true,
          createdAt: true,
        },
      }),
    ]);

    if (!user) return res.status(404).json({ message: "Portfolio not found" });

    return res.json({
      portfolio,
      user: { id: user.id, name: user.name },
      profile,
      skills: skills.map((s) => s.skill),
      projects,
    });
  } catch (err) {
    console.error("getPublicPortfolio:", err);
    return res.status(500).json({ message: "Failed to load portfolio" });
  }
};
