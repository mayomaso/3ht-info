(function () {
  var openBtn = document.getElementById("rozpis-open");
    var lightbox = document.getElementById("lightbox");
      var lightboxImg = document.getElementById("lightbox-img");
        var closeBtn = document.getElementById("lightbox-close");
          var sourceImg = document.getElementById("rozpis-img");

            function open() {
                lightboxImg.src = sourceImg.src;
                    lightbox.classList.remove("hidden");
                        document.body.style.overflow = "hidden";
                          }

                            function close() {
                                lightbox.classList.add("hidden");
                                    lightboxImg.src = "";
                                        document.body.style.overflow = "";
                                          }

                                            openBtn.addEventListener("click", open);
                                              closeBtn.addEventListener("click", close);
                                                lightbox.addEventListener("click", function (e) {
                                                    if (e.target === lightbox) close();
                                                      });
                                                        document.addEventListener("keydown", function (e) {
                                                            if (e.key === "Escape") close();
                                                              });
                                                              })();
                                                              
