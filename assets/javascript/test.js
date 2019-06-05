var mediaCheck = window.matchMedia("(max-width: 750px)");
checksize(mediaCheck);

function checksize(mediaCheck) {
  if (mediaCheck.matches) {
    console.log($(".card").css("width"));
  } else {
    console.log("nope");
    console.log("-------");
  }
}

mediaCheck.addListener(checksize);
