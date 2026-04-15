const intro = document.getElementById("intro");
const videoIntro = document.getElementById("introVideo");

const introtext = document.getElementById("introtext");
const precamera = document.getElementById("precamera");
const conteudotext = document.getElementById("conteudotext");

const video2 = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const foto = document.getElementById("fotoFinal");

const btn = document.getElementById("capture");
const voltar = document.getElementById("voltar");
const btnIrCamera = document.getElementById("irCamera");
const voltarInstrucao = document.getElementById("voltarInstrucao");

let streamAtual = null;

/* 🔥 FUNÇÃO PARA CONTROLAR TELAS */
function mostrarTela(tela) {
  intro.style.display = "none";
  introtext.style.display = "none";
  precamera.style.display = "none";
  conteudotext.style.display = "none";

  tela.style.display = "flex";
}

/* 🎬 INTRO */
videoIntro.addEventListener("ended", () => {
  mostrarTela(introtext);

  setTimeout(() => {
    mostrarTela(precamera);
  }, 8000);
});

/* 📷 ABRIR CÂMERA */
function abrirCamera() {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" }
  })
  .then(stream => {
    streamAtual = stream;
    video2.srcObject = stream;
  })
  .catch(err => console.error(err));
}

/* 👉 IR PARA CÂMERA */
btnIrCamera.addEventListener("click", () => {
  mostrarTela(conteudotext);
  abrirCamera();
});

/* 📸 TIRAR FOTO */
btn.addEventListener("click", () => {

  const w = video2.videoWidth || 1080;
  const h = video2.videoHeight || 1920;

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video2, 0, 0, w, h);

  canvas.toBlob((blob) => {

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "fotos_pier");

    fetch("https://api.cloudinary.com/v1_1/dp8tnlgtk/image/upload", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      foto.src = data.secure_url;
      foto.style.display = "block";
      voltar.style.display = "block";
    })
    .catch(err => console.error(err));

  }, "image/jpeg", 0.9);
});

/* 🔄 NOVA FOTO */
voltar.addEventListener("click", () => {
  abrirCamera();
});

/* 🔙 VOLTAR INSTRUÇÃO */
voltarInstrucao.addEventListener("click", () => {

  if (streamAtual) {
    streamAtual.getTracks().forEach(t => t.stop());
  }

  mostrarTela(precamera);
});