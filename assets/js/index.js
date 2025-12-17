// نعرف بقى
var themeBtn = document.getElementById("theme-toggle-button");
var settingsBtn = document.getElementById("settings-toggle");
var sidebar = document.getElementById("settings-sidebar");
var closeBtn = document.getElementById("close-settings");
var carousel = document.getElementById("testimonials-carousel");
var slides = carousel ? Array.from(carousel.querySelectorAll(".testimonial-card")) : [];
var nextBtn = document.getElementById("next-testimonial");
var prevBtn = document.getElementById("prev-testimonial");
var dots = document.querySelectorAll(".carousel-indicator");
var scrollBtn = document.getElementById("scroll-to-top");
var filterBtns = document.querySelectorAll("[data-filter]");
var portfolioItems = document.querySelectorAll("[data-category]");
var fontBtns = document.querySelectorAll("[data-font]");
var resetBtn = document.getElementById("reset-settings");
var navLinks = document.querySelectorAll("nav a[href^='#']");
var sections = document.querySelectorAll("section[id]");
var form = document.querySelector("#contact form");

var currentSlide = 0;
var slideCount = slides.length - 2;

// Theme colors
var colors = [
  { name: "Purple", primary: "#7B61F4", secondary: "#A78BFA", accent: "#C4B5FD" },
  { name: "Coral", primary: "#EF527A", secondary: "#F66936", accent: "#FB923C" },
  { name: "Green", primary: "#0AA573", secondary: "#10B981", accent: "#34D399" },
  { name: "Blue", primary: "#2C90EC", secondary: "#13AADC", accent: "#38BDF8" },
  { name: "Red", primary: "#F0434B", secondary: "#F34059", accent: "#FB7185" },
  { name: "Orange", primary: "#F3900C", secondary: "#EC650C", accent: "#FB923C" }
]; // معرفتش اعملهم غير بالطريقة ده والله

// Apply theme
function setTheme(p, s, a) {
  document.documentElement.style.cssText = `--color-primary: ${p}; --color-secondary: ${s}; --color-accent: ${a};`;
  localStorage.setItem("primary", p);
  localStorage.setItem("secondary", s);
  localStorage.setItem("accent", a);
}

// Create theme buttons
var colorGrid = document.getElementById("theme-colors-grid");
if (colorGrid) {
  colors.forEach(function(c) {
    var btn = document.createElement("button");
    btn.className = "mythemeclass w-12 h-12 rounded-full relative transition-transform hover:scale-110 cursor-pointer";
    btn.style.background = `linear-gradient(135deg, ${c.primary}, ${c.secondary})`;
    btn.setAttribute("data-primary", c.primary);
    btn.setAttribute("data-secondary", c.secondary);
    btn.setAttribute("data-accent", c.accent);
    btn.setAttribute("aria-label", c.name);
    btn.type = "button";
    
    btn.addEventListener("click", function() {
      document.querySelectorAll(".border-element").forEach(function(el) { el.remove(); });
      setTheme(c.primary, c.secondary, c.accent);
      
      var border = document.createElement("div");
      border.className = "border-element";
      border.style.cssText = `position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px; border: 2px solid ${c.primary}; border-radius: 50%; pointer-events: none;`;
      btn.style.position = "relative";
      btn.appendChild(border);
    }); // عايز اللي يعرفني اعملهم لون ممزوج ازاي
    
    colorGrid.appendChild(btn);
  });
}

// Font switcher
fontBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    var font = btn.getAttribute("data-font");
    
    // Remove active
    fontBtns.forEach(function(b) {
      b.classList.remove("active", "border-primary");
      b.classList.add("border-slate-200", "dark:border-slate-700");
    });
    
    // Add active
    btn.classList.add("active", "border-primary");
    btn.classList.remove("border-slate-200", "dark:border-slate-700");
    
    // Remove old fonts
    document.body.className = document.body.className.replace(/font-\w+/g, "").trim();
    document.body.classList.add("font-" + font);
    
    localStorage.setItem("font", "font-" + font);
  });
});

// Dark & Light
themeBtn.addEventListener("click", function() {
  document.documentElement.classList.toggle("dark");
  var isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Sidebar toggle
function toggleSidebar(open) {
  sidebar.classList.toggle("translate-x-full", !open);
  settingsBtn.style.transform = "translateY(-50%)";
  settingsBtn.style.right = open ? "20rem" : "0";
}

settingsBtn.addEventListener("click", function() {
  toggleSidebar(sidebar.classList.contains("translate-x-full"));
});

closeBtn.addEventListener("click", function() {
  toggleSidebar(false);
});

// Click outside
document.addEventListener("click", function(e) {
  if (!sidebar.contains(e.target) && !settingsBtn.contains(e.target) && !sidebar.classList.contains("translate-x-full")) {
    toggleSidebar(false);
  }
});

// Reset settings
resetBtn.addEventListener("click", function() {
  localStorage.clear();
  setTheme("#6366f1", "#8b5cf6", "#ec4899");
  document.body.className = document.body.className.replace(/font-\w+/g, "").trim();
  document.body.classList.add("font-tajawal");
  document.querySelectorAll(".border-element").forEach(function(el) { el.remove(); });
  
  fontBtns.forEach(function(b) {
    var isDefault = b.getAttribute("data-font") === "tajawal";
    b.classList.toggle("active", isDefault);
    b.classList.toggle("border-primary", isDefault);
    b.classList.toggle("border-slate-200", !isDefault);
    b.classList.toggle("dark:border-slate-700", !isDefault);
  });
  
  // Close sidebar
  toggleSidebar(false);
});

// Scroll spy
var visibility = new Map();
sections.forEach(function(s) { visibility.set(s.id, 0); });

// مكدبش عليك سرشت عليها عشان افهم اشغلها ازاي
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    visibility.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
  });
  
  var maxId = null;
  var maxRatio = 0;
  visibility.forEach(function(ratio, id) {
    if (ratio > maxRatio) {
      maxRatio = ratio;
      maxId = id;
    }
  });
  
  if (maxId) {
    navLinks.forEach(function(link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + maxId);
    });
  }
}, { threshold: [0.25, 0.5, 0.75] });

sections.forEach(function(s) { observer.observe(s); });

// Carousel navigation
function goToSlide(idx) {
  currentSlide = (idx + slideCount) % slideCount;
  carousel.style.transform = "translateX(" + (currentSlide * 100) / 3 + "%)";
  
  dots.forEach(function(dot, i) {
    var isActive = i === currentSlide;
    dot.classList.toggle("bg-accent", isActive);
    dot.classList.toggle("bg-slate-400", !isActive);
    dot.classList.toggle("dark:bg-slate-600", !isActive);
  });
}

dots.forEach(function(dot, i) {
  dot.addEventListener("click", function() { goToSlide(i); });
});

if (nextBtn) nextBtn.addEventListener("click", function() { goToSlide(currentSlide + 1); });
if (prevBtn) prevBtn.addEventListener("click", function() { goToSlide(currentSlide - 1); });

// Scroll to top
window.addEventListener("scroll", function() {
  var show = window.scrollY > 400;
  scrollBtn.classList.toggle("opacity-0", !show);
  scrollBtn.classList.toggle("invisible", !show);
  scrollBtn.classList.toggle("opacity-100", show);
  scrollBtn.classList.toggle("visible", show);
});

scrollBtn.addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Portfolio filter
filterBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    var filter = btn.dataset.filter;
    
    filterBtns.forEach(function(b) {
      var isActive = b === btn;
      b.classList.toggle("active", isActive);
      b.classList.toggle("bg-linear-to-r", isActive);
      b.classList.toggle("from-primary", isActive);
      b.classList.toggle("to-secondary", isActive);
      b.classList.toggle("text-white", isActive);
    });
    
    portfolioItems.forEach(function(item) {
      item.hidden = !(filter === "all" || item.dataset.category === filter);
    });
  });
});

// Custom selects
var selects = document.querySelectorAll(".custom-select");
selects.forEach(function(sel) {
  var options = sel.nextElementSibling;
  
  sel.addEventListener("click", function() {
    var isOpen = !options.classList.contains("hidden");
    
    // Close all
    document.querySelectorAll(".custom-options").forEach(function(o) {
      o.classList.add("hidden");
    });
    document.querySelectorAll(".custom-select i").forEach(function(i) {
      i.classList.remove("rotate-180");
    });
    
    if (!isOpen) {
      options.classList.remove("hidden");
      sel.querySelector("i").classList.add("rotate-180");
    }
  });
  
  options.querySelectorAll(".custom-option").forEach(function(opt) {
    opt.addEventListener("click", function() {
      sel.querySelector(".selected-text").textContent = opt.textContent;
      options.classList.add("hidden");
      sel.querySelector("i").classList.remove("rotate-180");
    });
  });
});

// Close selects
document.addEventListener("click", function(e) {
  if (!e.target.closest(".custom-select-wrapper")) {
    document.querySelectorAll(".custom-options").forEach(function(o) {
      o.classList.add("hidden");
    });
    document.querySelectorAll(".custom-select i").forEach(function(i) {
      i.classList.remove("rotate-180");
    });
  }
});

// بقى validationنيجي لل
// Form validation
if (form) {
  var nameRgx = /^[\u0621-\u064Aa-zA-Z\s]{3,50}$/;
  var emailRgx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  var phoneRgx = /^(010|011|012|015)\d{8}$/;
  
  // Show error message
  function showError(input, msg) {
    var parent = input.parentElement;
    var existing = parent.querySelector(".error-msg");
    if (existing) existing.remove();
    
    var error = document.createElement("p");
    error.className = "error-msg text-red-500 text-sm mt-2";
    error.textContent = msg;
    parent.appendChild(error);
    
    input.classList.add("border-red-500");
    input.classList.remove("border-slate-300", "dark:border-slate-600");
  }
  
  // Clear error message
  function clearError(input) {
    var parent = input.parentElement;
    var existing = parent.querySelector(".error-msg");
    if (existing) existing.remove();
    
    input.classList.remove("border-red-500");
    input.classList.add("border-slate-300", "dark:border-slate-600");
  }
  
  // Clear all errors
  function clearAllErrors() {
    form.querySelectorAll(".error-msg").forEach(function(e) { e.remove(); });
    form.querySelectorAll("input, textarea").forEach(function(i) {
      i.classList.remove("border-red-500");
      i.classList.add("border-slate-300", "dark:border-slate-600");
    });
  }
  
  // Real-time validation
  var nameInput = document.getElementById("full-name");
  var emailInput = document.getElementById("email");
  var phoneInput = document.getElementById("phone");
  var detailsInput = document.getElementById("project-details");
  
  nameInput.addEventListener("blur", function() {
    var val = this.value.trim();
    if (!val) {
      showError(this, "الاسم مطلوب");
    } else if (!nameRgx.test(val)) {
      showError(this, "الاسم يجب أن يكون بين 3 و 50 حرف");
    } else {
      clearError(this);
    }
  });
  
  emailInput.addEventListener("blur", function() {
    var val = this.value.trim();
    if (!val) {
      showError(this, "البريد الإلكتروني مطلوب");
    } else if (!emailRgx.test(val)) {
      showError(this, "البريد الإلكتروني غير صحيح");
    } else {
      clearError(this);
    }
  });
  
  phoneInput.addEventListener("blur", function() {
    var val = this.value.trim();
    if (val && !phoneRgx.test(val)) {
      showError(this, "رقم الهاتف يجب أن يبدأ بـ 010, 011, 012, أو 015 ويتبعه 8 أرقام");
    } else {
      clearError(this);
    }
  });
  
  detailsInput.addEventListener("blur", function() {
    var val = this.value.trim();
    if (!val) {
      showError(this, "تفاصيل المشروع مطلوبة");
    } else if (val.length < 10) {
      showError(this, "تفاصيل المشروع يجب أن تكون 10 أحرف على الأقل");
    } else {
      clearError(this);
    }
  });
  
  // Submit validation
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    clearAllErrors();
    
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var phone = phoneInput.value.trim();
    var details = detailsInput.value.trim();
    var isValid = true;
    
    // Validate name
    if (!name) {
      showError(nameInput, "الاسم مطلوب");
      isValid = false;
    } else if (!nameRgx.test(name)) {
      showError(nameInput, "الاسم يجب أن يكون بين 3 و 50 حرف"); // مين الذكي اللي هيسمي ابنه اسم ب 50 حرف؟
      isValid = false;
    }
    
    // Validate email
    if (!email) {
      showError(emailInput, "البريد الإلكتروني مطلوب");
      isValid = false;
    } else if (!emailRgx.test(email)) {
      showError(emailInput, "البريد الإلكتروني غير صحيح");
      isValid = false;
    }
    
    // Validate phone
    if (phone && !phoneRgx.test(phone)) {
      showError(phoneInput, "رقم الهاتف يجب أن يبدأ بـ 010, 011, 012, أو 015 ويتبعه 8 أرقام"); //طب واللي تلفونه مش مصري 🙄
      isValid = false;
    }
    
    // Validate details
    if (!details) {
      showError(detailsInput, "تفاصيل المشروع مطلوبة");
      isValid = false;
    } else if (details.length < 10) {
      showError(detailsInput, "تفاصيل المشروع يجب أن تكون 10 أحرف على الأقل");
      isValid = false;
    }
    
    if (isValid) {
      // Show success message
      var successDiv = document.createElement("div");
      successDiv.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50 animate-bounce";
      successDiv.innerHTML = '<i class="fa-solid fa-check-circle ml-2"></i>تم إرسال الرسالة بنجاح!';
      document.body.appendChild(successDiv);
      
      setTimeout(function() {
        successDiv.remove();
      }, 3000);
      
      form.reset();
      clearAllErrors();
    }
  });
}

// Load saved settings
document.addEventListener("DOMContentLoaded", function() {
  // Load theme
  var theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  // Load colors
  var p = localStorage.getItem("primary") || "#6366f1";
  var s = localStorage.getItem("secondary") || "#8b5cf6";
  var a = localStorage.getItem("accent") || "#ec4899";
  setTheme(p, s, a);
  
  // Load font
  var savedFont = localStorage.getItem("font") || "font-tajawal";
  document.body.className = document.body.className.replace(/font-\w+/g, "").trim();
  document.body.classList.add(savedFont);
  
  // Set active font
  fontBtns.forEach(function(btn) {
    var font = btn.getAttribute("data-font");
    var isActive = savedFont === "font-" + font;
    btn.classList.toggle("active", isActive);
    btn.classList.toggle("border-primary", isActive);
    btn.classList.toggle("border-slate-200", !isActive);
    btn.classList.toggle("dark:border-slate-700", !isActive);
  });
});