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


(function () {
  var BAZAR_CSV_URL = "https://docs.google.com/spreadsheets/d/1B86TB5P99_JALMn8K1JuOSOjZ1ONwfF3kpaDmEVLs8E/export?format=csv&gid=423172829";
  var container = document.getElementById("bazar-list");
  if (!container) return;

  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += c;
        }
      } else {
        if (c === '"') {
          inQuotes = true;
        } else if (c === ",") {
          row.push(field);
          field = "";
        } else if (c === "\n") {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        } else if (c === "\r") {
          // skip
        } else {
          field += c;
        }
      }
    }
    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function driveIdFromUrl(url) {
    var m = String(url || "").match(/[-\w]{25,}/);
    return m ? m[0] : null;
  }

  fetch(BAZAR_CSV_URL)
    .then(function (r) {
      if (!r.ok) throw new Error("fetch failed");
      return r.text();
    })
    .then(function (text) {
      var rows = parseCSV(text).filter(function (r) {
        return r.length > 1 && r[0];
      });
      var items = rows.slice(1);
      if (!items.length) {
        container.innerHTML = '<p class="bazar-empty">Zatiaľ tu nie sú žiadne položky. Buď prvý!</p>';
        return;
      }
      items.reverse();
      var html = "";
      items.forEach(function (cols) {
        var nazov = cols[1];
        var cena = cols[2];
        var kontakt = cols[3];
        var popis = cols[4];
        var fotka = cols[5];
        var fileId = driveIdFromUrl(fotka);
        var imgHtml = "";
        if (fileId) {
          imgHtml =
            '<img class="bazar-photo" src="https://lh3.googleusercontent.com/d/' +
            fileId +
            '=w400" alt="' +
            escapeHtml(nazov) +
            '" loading="lazy">';
        }
        html +=
          '<div class="bazar-card">' +
          imgHtml +
          '<div class="bazar-card-body">' +
          "<h3>" + escapeHtml(nazov || "Bez názvu") + "</h3>" +
          '<p class="bazar-price">' + escapeHtml(cena) + "</p>" +
          '<p class="bazar-desc">' + escapeHtml(popis) + "</p>" +
          '<p class="bazar-contact">' + escapeHtml(kontakt) + "</p>" +
          "</div></div>";
      });
      container.innerHTML = html;
    })
    .catch(function () {
      container.innerHTML = '<p class="bazar-empty">Ponuku sa nepodarilo načítať. Skús neskôr.</p>';
    });
})();
