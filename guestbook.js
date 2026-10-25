/* Read public guestbook comments as plain text. Never render visitor HTML. */
(function () {
  "use strict";
  var container = document.getElementById("guestbook-notes");
  if (!container) return;
  var endpoint = "https://api.github.com/repos/eggseed1/eggseed/issues/1/comments?per_page=100";
  var status = container.querySelector(".guestbook-status");
  function message(txt) { if (status) status.textContent = txt; }
  function el(tag, cls, text) {
    var item = document.createElement(tag);
    if (cls) item.className = cls;
    if (text !== undefined) item.textContent = text;
    return item;
  }
  fetch(endpoint, { headers: { Accept: "application/vnd.github+json" } })
    .then(function (res) { if (!res.ok) throw Error("unavailable"); return res.json(); })
    .then(function (comments) {
      if (!Array.isArray(comments)) throw Error("invalid response");
      if (!comments.length) { message("no notes yet! wanna be the first? ♡"); return; }
      var entries = document.createDocumentFragment();
      comments.slice(-50).reverse().forEach(function (note) {
        var card = el("article", "guestbook-entry");
        var head = el("div", "guestbook-entry-header");
        var username = (note.user && typeof note.user.login === "string") ? note.user.login : "visitor";
        var user = el("a", "guestbook-entry-name", username);
        user.href = "https://github.com/" + encodeURIComponent(username);
        user.target = "_blank";
        user.rel = "noopener noreferrer";
        head.appendChild(user);
        if (note.created_at) {
          var date = new Date(note.created_at);
          if (!Number.isNaN(date.getTime())) {
            var time = el("time", "guestbook-entry-date", date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toLowerCase());
            time.dateTime = note.created_at;
            head.appendChild(time);
          }
        }
        card.appendChild(head);
        card.appendChild(el("p", "guestbook-entry-body", typeof note.body === "string" ? note.body : ""));
        entries.appendChild(card);
      });
      container.replaceChildren(entries);
    })
    .catch(function () { message("can't load notes right now — you can still read or sign the guestbook on github!"); });
}());