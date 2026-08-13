(function () {
  var openBtns = document.querySelectorAll(".rozpis-thumb-btn");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var closeBtn = document.getElementById("lightbox-close");

  function open(src) {
    lightboxImg.src = src;
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var img = btn.querySelector("img");
      if (img) open(img.src);
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();
