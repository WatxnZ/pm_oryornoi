function toggleMenu() {
  const menu = document.querySelector(".menu");
  const isActive = menu.classList.toggle("active");
  document.body.classList.toggle("menu-open", isActive);
}

document.addEventListener("click", function (e) {
  const menu = document.querySelector(".menu");
  const toggle = document.querySelector(".menu-toggle");
  const isMenuOpen = document.body.classList.contains("menu-open");

  if (isMenuOpen && !menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove("active");
    document.body.classList.remove("menu-open");
  }
});

let current = location.pathname.split("/").pop();
if (!current || current === "") {
  current = "index.html"; // หากเปิดเว็บแบบ root เช่น /
}

const links = document.querySelectorAll(".menu a");
links.forEach((link) => {
  const href = link.getAttribute("href");
  if (href === current) {
    link.classList.add("active");
  }
});

window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  // ซ่อน Loader แล้วแสดงเนื้อหาเว็บ
  loader.style.display = "none";
  content.style.display = "block";
});

document.addEventListener("DOMContentLoaded", () => {
  // 👉 Dropdown toggle (เมนูเกี่ยวกับ)
  document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = toggle.closest(".dropdown");
      parent?.classList.toggle("active");
    });
  });

  // 👉 Popup ประกาศ
  const popup = document.getElementById("image-popup");
  const popupImage = document.getElementById("popup-image");
  const popupMessage = document.getElementById("popup-message");
  const closeBtn = document.getElementById("close-popup");
  const dontShowCheckbox = document.getElementById("dont-show-checkbox");

  const announcements = [
    {
      id: "1ประกาศ",
      imageUrl: "https://img5.pic.in.th/file/secure-sv1/qrcode-.jpeg",
      message:
        "คิวอาร์โค้ดแจ้งปัญหาด้านสุขภาพ ภายในโรงเรียน เช่น ด้านการบริโภค เรื่องสุขภัณฑ์",
      messageClass: "important-message",
    },
    {
      id: "แจ้งปัญหา",
      imageUrl: "https://img5.pic.in.th/file/secure-sv1/144584.jpg",
      message: "แจ้งปัญหาต่าง ๆ ด้านสุขภาพอนามัย ภายในโรงเรียน แสกนเลย!",
      messageClass: "important-message",
    },
  ];

  let currentIndex = 0;

  function fadeOut(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms`;
      element.style.opacity = 0;
      setTimeout(() => resolve(), duration);
    });
  }

  function fadeIn(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms`;
      element.style.opacity = 1;
      setTimeout(() => resolve(), duration);
    });
  }

  async function showAnnouncement(index) {
    if (index >= announcements.length) {
      await fadeOut(popup);
      popup.style.display = "none";
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      return;
    }

    const ann = announcements[index];
    const storageKey = "hideAnnouncementPopup_" + ann.id;

    if (localStorage.getItem(storageKey)) {
      await showAnnouncement(index + 1);
      return;
    }

    if (popup.style.display !== "flex") {
      popup.style.display = "flex";
      document.body.style.overflow = "hidden"; // ป้องกัน scroll
      document.body.style.pointerEvents = "none"; // ป้องกัน interaction
      popup.style.pointerEvents = "auto"; // ยกเว้น popup คลิกได้
      popup.style.opacity = 0;
    } else {
      await fadeOut(popup);
    }

    popupImage.src = ann.imageUrl;
    popupImage.alt = ann.message;
    popupMessage.textContent = ann.message;
    popupMessage.className = ann.messageClass;
    dontShowCheckbox.checked = false;

    await fadeIn(popup);
    currentIndex = index;
  }

  closeBtn?.addEventListener("click", async () => {
    const ann = announcements[currentIndex];
    const storageKey = "hideAnnouncementPopup_" + ann.id;

    if (dontShowCheckbox.checked) {
      localStorage.setItem(storageKey, "true");
    }

    await showAnnouncement(currentIndex + 1);
  });

  showAnnouncement(0);
});

// นำเข้า HTML
function includeHTML() {
  const elements = document.querySelectorAll("[include-html]");
  elements.forEach((el) => {
    const file = el.getAttribute("include-html");
    fetch(file)
      .then((res) => res.text())
      .then((data) => {
        el.innerHTML = data;
        el.removeAttribute("include-html");
        includeHTML(); // ซ้อนกันได้
      });
  });
}

window.addEventListener("DOMContentLoaded", includeHTML);

class ImageSlider {
  constructor() {
    this.currentIndex = 0;
    this.isPlaying = true;
    this.autoSlideInterval = null;
    this.slides = document.querySelectorAll(".slide");
    this.totalSlides = this.slides.length;

    this.sliderTrack = document.getElementById("sliderTrack");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.statusBadge = document.getElementById("statusBadge");
    this.currentSlideSpan = document.getElementById("currentSlide");
    this.totalSlidesSpan = document.getElementById("totalSlides");
    this.slideTitle = document.getElementById("slideTitle");
    this.dots = document.querySelectorAll(".dot");

    this.slideData = Array.from(this.slides).map(
      (slide) => slide.getAttribute("data-caption") || ""
    );

    this.init();
  }

  init() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    this.startAutoSlide();
    this.updateDisplay();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateDisplay();
    this.handleInteraction();
  }

  prevSlide() {
    this.currentIndex =
      this.currentIndex === 0 ? this.totalSlides - 1 : this.currentIndex - 1;
    this.updateDisplay();
    this.handleInteraction();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateDisplay();
    this.handleInteraction();
  }

  updateDisplay() {
    // อัปเดตตำแหน่งสไลด์
    this.sliderTrack.style.transform = `translateX(-${
      this.currentIndex * 100
    }%)`;

    // อัปเดตจุด
    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });

    // อัปเดตข้อมูลภาพ
    this.currentSlideSpan.textContent = this.currentIndex + 1;
    this.slideTitle.textContent = this.slideData[this.currentIndex];
  }

  startAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }

    this.autoSlideInterval = setInterval(() => {
      if (this.isPlaying) {
        this.nextSlide();
      }
    }, 5000);
  }

  handleInteraction() {
    this.isPlaying = false;
    this.statusBadge.textContent = "Manual";
    this.statusBadge.className = "status-badge status-manual";

    // เริ่มการเลื่อนอัตโนมัติใหม่หลังจาก 5 วินาที
    setTimeout(() => {
      this.isPlaying = true;
      this.statusBadge.textContent = "Auto";
      this.statusBadge.className = "status-badge status-auto";
    }, 5000);
  }
}

// เริ่มต้นสไลด์เดอร์เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
  new ImageSlider();
});

function calculateBMI() {
  const weight = parseFloat(document.getElementById("weight").value);
  const heightCm = parseFloat(document.getElementById("height").value);
  if (isNaN(weight) || isNaN(heightCm) || heightCm === 0) {
    document.getElementById("bmi-result").textContent =
      "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง";
    return;
  }
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let result = `ค่า BMI ของคุณคือ ${bmi.toFixed(2)} `;

  if (bmi < 18.5) result += "(น้ำหนักน้อย)";
  else if (bmi < 23) result += "(น้ำหนักปกติ)";
  else if (bmi < 25) result += "(น้ำหนักเกิน)";
  else if (bmi < 30) result += "(อ้วนระดับ 1)";
  else result += "(อ้วนระดับ 2)";

  document.getElementById("bmi-result").textContent = result;
}

// โปรแกรมคำนวณ BMR และ TDEE
function calculateBMR_TDEE() {
  var gender = document.getElementById("bmr-gender").value;
  var age = parseFloat(document.getElementById("bmr-age").value);
  var weight = parseFloat(document.getElementById("bmr-weight").value);
  var height = parseFloat(document.getElementById("bmr-height").value);
  var activity = parseFloat(document.getElementById("bmr-activity").value);

  if (isNaN(age) || isNaN(weight) || isNaN(height)) {
    document.getElementById("bmr-result").innerText =
      "กรุณากรอกข้อมูลให้ครบถ้วน";
    document.getElementById("tdee-result").innerText = "";
    return;
  }

  var bmr;
  if (gender === "male") {
    bmr = 66 + 13.7 * weight + 5 * height - 6.8 * age;
  } else {
    bmr = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
  }
  var tdee = bmr * activity;
  document.getElementById("bmr-result").innerText =
    "BMR ของคุณคือ " + bmr.toFixed(2) + " กิโลแคลอรี่/วัน";
  document.getElementById("tdee-result").innerText =
    "TDEE ของคุณคือ " + tdee.toFixed(2) + " กิโลแคลอรี่/วัน";
}
