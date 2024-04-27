if (window.location.search.includes("popup=true")) {
  window.history.replaceState({}, "", "/popup");
  // console.log("popup");
}
