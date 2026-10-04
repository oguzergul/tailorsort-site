// Shows the page in one language: ?lang=tr|en (the game passes the device's), else the browser's, Turkish for Turkish
// browsers and English for everyone else. The toggle switches without reloading and keeps the choice in the address.
(function () {
  document.documentElement.classList.add("js");
  var params = new URLSearchParams(location.search);
  var asked = (params.get("lang") || "").toLowerCase();
  var browser = (navigator.language || "en").toLowerCase();
  var lang = asked === "tr" || asked === "en" ? asked : browser.indexOf("tr") === 0 ? "tr" : "en";

  function show(next) {
    lang = next;
    document.documentElement.lang = next;
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.classList.toggle("shown", el.getAttribute("data-lang") === next);
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.value === next));
    });
    document.querySelectorAll("a[data-keep-lang]").forEach(function (a) {
      var url = new URL(a.getAttribute("href"), location.href);
      url.searchParams.set("lang", next);
      a.href = url.pathname.split("/").pop() + url.search + url.hash;
    });
    var title = document.querySelector('meta[name="title-' + next + '"]');
    if (title) document.title = title.content;
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () {
        show(b.value);
        var url = new URL(location.href);
        url.searchParams.set("lang", b.value);
        history.replaceState(null, "", url);
      });
    });
    show(lang);
    // #delete and similar anchors point at a section in both languages (id "delete-tr" / "delete-en"): open the shown one
    var anchor = location.hash.slice(1);
    var target = anchor && document.getElementById(anchor + "-" + lang);
    if (target) target.scrollIntoView();
  });
})();
