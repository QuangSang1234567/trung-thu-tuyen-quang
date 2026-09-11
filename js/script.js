/* =====================================================
   DANH SÁCH ẢNH
===================================================== */

const photos = [
  {
    image: "images/anh1.jpg",

    title: "Lần đầu nhìn thấy em...",

    text: "Anh đã nghĩ, cô gái này có một nụ cười thật đặc biệt.",
  },

  {
    image: "images/anh2.jpg",

    title: "Rồi càng nhìn...",

    text: "Anh lại càng thấy em có một điều gì đó rất riêng.",
  },

  {
    image: "images/anh3.jpg",

    title: "Có lẽ...",

    text: "Điều đáng yêu nhất của Trung Thu năm nay là có em.",
  },

  {
    image: "images/anh4.jpg",

    title: "Giữa hàng nghìn ánh đèn...",

    text: "Anh vẫn dễ dàng nhận ra ánh sáng đặc biệt nhất.",
  },

  {
    image: "images/anh5.jpg",

    title: "Và nếu được chọn...",

    text: "Anh vẫn muốn được nhìn thấy nụ cười này thêm nhiều lần nữa.",
  },
];

/* =====================================================
   VARIABLES
===================================================== */

let currentIndex = 0;

const screens = document.querySelectorAll(".screen");

const progressDots = document.querySelectorAll(".progress-dot");

const gallery = document.getElementById("gallery");

const galleryDots = document.getElementById("galleryDots");

const photoCaption = document.getElementById("photoCaption");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

/* =====================================================
   CREATE STARS
===================================================== */

function createStars() {
  const stars = document.getElementById("stars");

  const amount = window.innerWidth < 700 ? 70 : 120;

  for (let i = 0; i < amount; i++) {
    const star = document.createElement("div");

    star.className = "star";

    star.style.left = Math.random() * 100 + "%";

    star.style.top = Math.random() * 100 + "%";

    star.style.setProperty("--duration", 2 + Math.random() * 4 + "s");

    star.style.animationDelay = Math.random() * 4 + "s";

    stars.appendChild(star);
  }
}

createStars();

/* =====================================================
   SCREEN NAVIGATION
===================================================== */

let currentScreen = 0;

function showScreen(index) {
  if (index < 0) {
    index = 0;
  }

  if (index >= screens.length) {
    index = screens.length - 1;
  }

  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });

  progressDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  currentScreen = index;
}

/* =====================================================
   NEXT BUTTON
===================================================== */

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(currentScreen + 1);
  });
});

/* =====================================================
   MOUSE WHEEL
===================================================== */

let wheelLock = false;

window.addEventListener(
  "wheel",
  (event) => {
    if (wheelLock) return;

    wheelLock = true;

    if (event.deltaY > 0) {
      showScreen(currentScreen + 1);
    } else {
      showScreen(currentScreen - 1);
    }

    setTimeout(() => {
      wheelLock = false;
    }, 800);
  },
  {
    passive: true,
  },
);

/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    showScreen(currentScreen + 1);
  }

  if (event.key === "ArrowUp") {
    showScreen(currentScreen - 1);
  }

  if (event.key === "ArrowRight" && currentScreen === 1) {
    nextPhoto();
  }

  if (event.key === "ArrowLeft" && currentScreen === 1) {
    previousPhoto();
  }
});

/* =====================================================
   RENDER GALLERY
===================================================== */

function renderGallery() {
  gallery.innerHTML = "";

  galleryDots.innerHTML = "";

  photos.forEach((photo, index) => {
    const card = document.createElement("div");

    card.className = "photo-card";

    card.dataset.index = index;

    const img = document.createElement("img");

    img.src = photo.image;

    img.alt = photo.title;

    /*
     * Nếu chưa có ảnh
     * thì hiện placeholder.
     */

    img.onerror = function () {
      this.src = createPlaceholder(index);
    };

    card.appendChild(img);

    gallery.appendChild(card);

    /*
     * DOT
     */

    const dot = document.createElement("span");

    dot.className = "gallery-dot";

    dot.addEventListener("click", () => {
      currentIndex = index;

      updateGallery();
    });

    galleryDots.appendChild(dot);
  });

  updateGallery();
}

/* =====================================================
   PLACEHOLDER
===================================================== */

function createPlaceholder(index) {
  const text = `ẢNH ${index + 1}`;

  const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="800"
        >

            <defs>

                <linearGradient
                    id="g"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >

                    <stop
                        offset="0%"
                        stop-color="#252b60"
                    />

                    <stop
                        offset="100%"
                        stop-color="#8b3158"
                    />

                </linearGradient>

            </defs>

            <rect
                width="100%"
                height="100%"
                fill="url(#g)"
            />

            <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                fill="white"
                font-size="55"
                font-family="Arial"
            >
                ${text}
            </text>

        </svg>
    `;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

/* =====================================================
   UPDATE GALLERY
===================================================== */

function updateGallery() {
  const cards = gallery.querySelectorAll(".photo-card");

  const dots = galleryDots.querySelectorAll(".gallery-dot");

  cards.forEach((card, index) => {
    card.classList.remove("active", "left", "right", "far");

    let diff = index - currentIndex;

    /*
     * Xử lý vòng tròn
     */

    if (diff > photos.length / 2) {
      diff -= photos.length;
    }

    if (diff < -photos.length / 2) {
      diff += photos.length;
    }

    if (diff === 0) {
      card.classList.add("active");
    } else if (diff === -1) {
      card.classList.add("left");
    } else if (diff === 1) {
      card.classList.add("right");
    } else {
      card.classList.add("far");
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  const photo = photos[currentIndex];

  photoCaption.innerHTML = `
        <h3>
            ${photo.title}
        </h3>

        <p>
            ${photo.text}
        </p>
    `;
}

/* =====================================================
   NEXT PHOTO
===================================================== */

function nextPhoto() {
  currentIndex++;

  if (currentIndex >= photos.length) {
    currentIndex = 0;
  }

  updateGallery();
}

/* =====================================================
   PREVIOUS PHOTO
===================================================== */

function previousPhoto() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = photos.length - 1;
  }

  updateGallery();
}

prevBtn.addEventListener("click", previousPhoto);

nextBtn.addEventListener("click", nextPhoto);

/* =====================================================
   SWIPE MOBILE
===================================================== */

let touchStartX = 0;
let touchEndX = 0;

gallery.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].screenX;
  },
  {
    passive: true,
  },
);

gallery.addEventListener(
  "touchend",
  (event) => {
    touchEndX = event.changedTouches[0].screenX;

    handleSwipe();
  },
  {
    passive: true,
  },
);

function handleSwipe() {
  const distance = touchEndX - touchStartX;

  // Nếu vuốt quá ngắn thì bỏ qua
  if (Math.abs(distance) < 40) {
    return;
  }

  // ================================
  // VUỐT SANG TRÁI
  // ================================

  if (distance < 0) {
    if (currentIndex < photos.length - 1) {
      currentIndex++;
      updateGallery();
    } else {
      showScreen(currentScreen + 1);
    }
  }

  // ================================
  // VUỐT SANG PHẢI
  // ================================
  else {
    if (currentIndex > 0) {
      currentIndex--;
      updateGallery();
    } else {
      showScreen(currentScreen - 1);
    }
  }
}

/* =====================================================
   3D MOUSE TILT
===================================================== */

gallery.addEventListener("mousemove", (event) => {
  if (window.innerWidth < 700) {
    return;
  }

  const activeCard = gallery.querySelector(".photo-card.active");

  if (!activeCard) {
    return;
  }

  const rect = gallery.getBoundingClientRect();

  const x = event.clientX - rect.left;

  const y = event.clientY - rect.top;

  const centerX = rect.width / 2;

  const centerY = rect.height / 2;

  const rotateY = ((x - centerX) / centerX) * 8;

  const rotateX = (-(y - centerY) / centerY) * 8;

  activeCard.style.transform = `
            translate(-50%, -50%)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.02)
            `;
});

gallery.addEventListener("mouseleave", () => {
  const activeCard = gallery.querySelector(".photo-card.active");

  if (activeCard) {
    activeCard.style.transform = "";
  }
});

/* =====================================================
   ACCEPT BUTTON
===================================================== */

const yesBtn = document.getElementById("yesBtn");

const maybeBtn = document.getElementById("maybeBtn");

const finalMessage = document.getElementById("finalMessage");

yesBtn.addEventListener("click", () => {
  finalMessage.innerHTML =
    "Vậy mình hẹn nhau nhé. ❤️<br>" + "Trung Thu này anh chờ em.";

  createConfetti();
});

/* =====================================================
   MAYBE BUTTON
===================================================== */

maybeBtn.addEventListener("click", () => {
  finalMessage.innerHTML =
    "Ừm... em cứ suy nghĩ nhé 🤭<br>" +
    "Nhưng anh vẫn hy vọng câu trả lời là YES ❤️";
});

/* =====================================================
   CONFETTI
===================================================== */

function createConfetti() {
  const container = document.getElementById("confetti");

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti";

    piece.style.left = Math.random() * 100 + "%";

    piece.style.setProperty("--x", Math.random() * 300 - 150 + "px");

    piece.style.setProperty("--rotate", Math.random() * 720 - 360 + "deg");

    piece.style.setProperty("--fall", 2 + Math.random() * 3 + "s");

    piece.style.background = ["#ff5277", "#ffd76a", "#ff7135", "#ffffff"][
      Math.floor(Math.random() * 4)
    ];

    piece.style.animationDelay = Math.random() * 0.7 + "s";

    container.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 5000);
  }
}

/* =====================================================
   INITIALIZE
===================================================== */

renderGallery();

showScreen(0);
