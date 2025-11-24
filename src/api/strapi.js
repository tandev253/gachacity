// ===========================
// BASE URL
// ===========================
export const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL ||
  "http://15.235.160.215:1338";

const AUTH_BACKEND_URL =
  import.meta.env.VITE_AUTH_BACKEND_URL ||
  "https://gachacity.onrender.com";

const API_ROOT = `${STRAPI_URL}/api`;

// ===========================
// HELPER
// ===========================
async function fetchFromStrapi(path) {
  const res = await fetch(`${API_ROOT}${path}`);

  if (!res.ok) {
    throw new Error(
      `Strapi request failed: ${res.status}`,
    );
  }

  return res.json();
}

export function toAbsoluteUrl(url) {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `${STRAPI_URL}${url}`;
}

export function resolveImage(formats) {
  if (!formats) return "";

  const img =
    formats?.small?.url ||
    formats?.thumbnail?.url ||
    formats?.medium?.url ||
    formats?.large?.url ||
    formats?.url ||
    "";

  return toAbsoluteUrl(img);
}

// ===========================
// DASHBOARD
// ===========================
export async function getDashboard() {
  try {
    const json = await fetchFromStrapi(
      "/dashboard",
    );
    return json.data?.attributes || {};
  } catch (err) {
    console.error("Dashboard error:", err);
    return {};
  }
}

// ===========================
// NEWS
// ===========================
function mapNewsItem(raw) {
  const attr = raw.attributes || raw;
  const id = raw.id ?? attr.id;

  return {
    id,
    title: attr.title,
    slug:
      attr.slug || attr.documentId || String(id),
    shortDescription: attr.shortDescription,
    content: attr.content,
    imageUrl: resolveImage(attr.cover),
    isFeatured: attr.isFeatured ?? false,
    seoTitle: attr.seoTitle,
    seoDescription: attr.seoDescription,
    createdAt: attr.createdAt,
    updatedAt: attr.updatedAt,
    publishedAt: attr.publishedAt,
  };
}

export async function getNewsItems() {
  const json = await fetchFromStrapi(
    "/news-items?populate=cover&sort=createdAt:desc",
  );
  return (json.data || []).map(mapNewsItem);
}

export async function getFeaturedNews(limit = 3) {
  const json = await fetchFromStrapi(
    `/news-items?filters[isFeatured][$eq]=true&populate=cover&sort=createdAt:desc&pagination[limit]=${limit}`,
  );
  return (json.data || []).map(mapNewsItem);
}

export async function getNewsItemBySlug(slug) {
  const encodedSlug = encodeURIComponent(slug);
  const json = await fetchFromStrapi(
    `/news-items?filters[slug][$eq]=${encodedSlug}&populate=cover`,
  );
  const data = json.data?.[0];
  return data ? mapNewsItem(data) : null;
}

export async function getNewsDetail(slug) {
  const encodedSlug = encodeURIComponent(slug);
  const json = await fetchFromStrapi(
    `/news-items?filters[slug][$eq]=${encodedSlug}&populate=cover`,
  );
  const row = json.data?.[0];
  if (!row) return null;
  return mapNewsItem(row);
}

// ===========================
// BUSINESSES
// ===========================
export async function getBusinesses() {
  try {
    const json = await fetchFromStrapi(
      "/businesses?populate=logo&sort=order:asc",
    );

    return (json.data || []).map((item) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      slug: item.slug,
      order: item.order ?? 0,
      description: item.Description ?? "",
      active: item.active,
      logoUrl: resolveImage(item.logo),
    }));
  } catch (err) {
    console.error("Businesses error:", err);
    return [];
  }
}

// ===========================
// MEDIA VIDEO
// ===========================
export async function getMediaVideo() {
  try {
    const json = await fetchFromStrapi(
      "/media-section",
    );

    const videoUrl =
      json?.data?.attributes?.videoUrl ??
      json?.data?.videoUrl ??
      "";

    console.log("getMediaVideo json:", json);
    console.log(
      "getMediaVideo videoUrl:",
      videoUrl,
    );

    return { videoUrl };
  } catch (err) {
    console.error("Media section error:", err);
    return { videoUrl: "" };
  }
}

// ===========================
// ACCOUNT / PROFILE
// ===========================
export async function getAccount() {
  const token =
    localStorage.getItem("gc_token") ||
    localStorage.getItem("gc_access_token") ||
    localStorage.getItem("gc_jwt");

  if (!token) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const res = await fetch(
    `${AUTH_BACKEND_URL}/api/account/me`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("gc_token");
      localStorage.removeItem("gc_access_token");
      localStorage.removeItem("gc_jwt");
      throw new Error("UNAUTHORIZED");
    }
    throw new Error("FAILED");
  }

  const data = await res.json();
  return data; 
}

// ===========================
// GUIDE PAGE CONFIG
// ===========================
export async function getGuidePageConfig() {
  try {
    const json = await fetchFromStrapi("/guide-page");
    return json.data?.attributes || {};
  } catch (err) {
    console.error("Guide page config error:", err);
    return {};
  }
}

function mapGuide(item) {
  if (!item) return null;
  const id = item.id;
  const attrs = item.attributes || item;

  const category =
    attrs.category ||
    attrs.Enumeration ||   
    attrs.enumeration ||
    "Khác";

  const rawSections = attrs.sections || [];
  const sections = rawSections.map((sec) => {
    const s = sec.attributes || sec;
    return {
      heading: s.heading || s.title || "",
      content: s.content || "",
    };
  });

  return {
    id,
    title: attrs.title || "",
    category,
    order: typeof attrs.order === "number" ? attrs.order : 9999,
    sections,
  };
}


export async function getGuides() {
  try {
    const query = "/guides?populate[sections]=*&sort=order:asc";
    const json = await fetchFromStrapi(query);

    const raw = json.data || [];
    return raw.map(mapGuide).filter(Boolean);
  } catch (err) {
    console.error("Guides error:", err);
    return [];
  }
}
