let captionActivated = false;
let captionLang = null;


anvp.onReady = function (p) {
    p.setListener(generalListener);
};

function generalListener(e) {
    // console.log("event: [" + e.name + "]", e.args);
    switch (e.name) {
        case "CAPTION_DETECTED":
        case "VIDEO_STARTED":
            console.log(captionActivated, captionLang)
            if(captionActivated){
                anvp.p0.setCaption(captionLang);
            }
            break;
        case "SET_CAPTION":
            let lang = e.args[0]
            if(lang){
                captionActivated = true ;
                captionLang = lang;
            }else{
                captionActivated = false;
                captionLang = null;
            }
            break;
        default:
            break;
    }
  }