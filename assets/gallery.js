(function () {
  const gallery = document.querySelector("[data-media-gallery]");
  const filters = document.querySelectorAll("[data-gallery-filter]");
  const count = document.querySelector("[data-gallery-count]");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxTitle = document.querySelector("[data-lightbox-title]");
  const closeButton = document.querySelector("[data-lightbox-close]");
  const previousButton = document.querySelector("[data-lightbox-prev]");
  const nextButton = document.querySelector("[data-lightbox-next]");
  const items = window.GIAS_GALLERY || [];
  let visibleImages = [];
  let currentImageIndex = 0;
  let lastFocusedElement = null;

  if (!gallery) return;

  const mediaPath = (file) => `assets/images/${encodeURIComponent(file)}`;
  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  function updateLightbox() {
    const item = visibleImages[currentImageIndex];
    if (!item || !lightboxImage || !lightboxTitle) return;
    lightboxImage.src = mediaPath(item.file);
    lightboxImage.alt = `${item.title} from the Gias Flooring gallery`;
    lightboxTitle.textContent = item.title;
  }

  function openLightbox(index, trigger) {
    if (!lightbox || !visibleImages[index]) return;
    currentImageIndex = index;
    lastFocusedElement = trigger;
    updateLightbox();
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton?.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage?.removeAttribute("src");
    lastFocusedElement?.focus();
  }

  function moveLightbox(direction) {
    if (!visibleImages.length) return;
    currentImageIndex = (currentImageIndex + direction + visibleImages.length) % visibleImages.length;
    updateLightbox();
  }

  function render(filter = "all") {
    const visible = items.filter((item) => filter === "all" || item.type === filter);
    visibleImages = visible.filter((item) => item.type === "image");
    let imageIndex = 0;

    gallery.innerHTML = visible.map((item) => {
      const source = mediaPath(item.file);
      const title = escapeHtml(item.title);
      const media = item.type === "video"
        ? `<video controls preload="metadata" playsinline aria-label="${title}"><source src="${source}" type="video/mp4">Your browser does not support embedded video.</video>`
        : `<button class="media-open" type="button" data-lightbox-index="${imageIndex++}" aria-label="Enlarge ${title}"><img src="${source}" alt="${title} from the Gias Flooring gallery" loading="lazy" decoding="async"><span class="media-zoom" aria-hidden="true">View larger</span></button>`;
      return `<figure class="media-card reveal visible" data-media-type="${item.type}"><div class="media-frame">${media}</div><figcaption><span>${title}</span><small>${item.type === "video" ? "Video" : "Photo"}</small></figcaption></figure>`;
    }).join("");
    if (count) count.textContent = `${visible.length} ${visible.length === 1 ? "item" : "items"}`;
  }

  gallery.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox-index]");
    if (!trigger) return;
    openLightbox(Number(trigger.dataset.lightboxIndex), trigger);
  });

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      closeLightbox();
      filters.forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      render(button.dataset.galleryFilter);
    });
  });

  closeButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", () => moveLightbox(-1));
  nextButton?.addEventListener("click", () => moveLightbox(1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
    if (event.key === "Tab") {
      const controls = [closeButton, previousButton, nextButton].filter(Boolean);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  render();
})();
