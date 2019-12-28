window.onload = () => {
    const body = document.body;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", "http://danigayo.info/HTML5/postmessage/ad_server.html");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("id", "anunciante");
    iframe.style = "display: none;";
    iframe.onload = enviarDatos;
    body.appendChild(iframe);
};

function recibirDatos(e) {
    const anuncio1 = document.getElementById("anuncio1");
    console.info(e.data);
    anuncio1.setAttribute("src", e.data);
    document.getElementById("anunciante").remove();
}

function enviarDatos(){
    let date = Date.now();
    console.log(date);
    window.addEventListener("message", recibirDatos, false);
    document.getElementById("anunciante").contentWindow.postMessage(date, '*');
}
