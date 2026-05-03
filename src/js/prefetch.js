// Hover-based prefetch for comic navigation links
// Desktop only (devices that support hover)

function supportsHover() {
  return window.matchMedia("(hover: hover)").matches;
}

if (supportsHover()) {
  const prefetched = new Set();

  document.addEventListener("mouseover", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    // ONLY prefetch comic navigation links (Older/Newer)
    if (!link.closest(".comic-nav-row")) return;

    const url = link.href;

    // Only prefetch internal links
    if (!url.startsWith(window.location.origin)) return;

    // Avoid duplicate prefetches
    if (prefetched.has(url)) return;

    prefetched.add(url);

    const linkTag = document.createElement("link");
    linkTag.rel = "prefetch";
    linkTag.href = url;

    document.head.appendChild(linkTag);
  });
}
