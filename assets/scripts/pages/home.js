lucide.createIcons();

async function loadModStat(slug, elementId){
  try{
    const response = await fetch("https://api.modrinth.com/v2/project/" + slug);
    const data = await response.json();
    document.getElementById(elementId).textContent = data.downloads.toLocaleString();
  }catch(_error){
    document.getElementById(elementId).textContent = "N/A";
  }
}

async function refreshStatus(){
  const setStatus = (id, url) => fetch(url).then((response) => {
    document.getElementById(id).textContent = response.ok ? "Online" : "Offline";
    document.getElementById(id).className = response.ok ? "online" : "offline";
  }).catch(() => {
    document.getElementById(id).textContent = "Offline";
    document.getElementById(id).className = "offline";
  });

  setStatus("status-site", location.href);
  setStatus("status-github", "https://api.github.com");
  setStatus("status-modrinth", "https://api.modrinth.com");
}

function initParticles(){
  const canvas = document.getElementById("bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const particles = [];

  function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }

  resize();
  addEventListener("resize", resize);

  for(let i = 0; i < 80; i += 1){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() * 0.5,
      vy: Math.random() * 0.5
    });
  }

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#58a6ff";

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y > canvas.height) particle.y = 0;

      ctx.fillRect(particle.x, particle.y, 2, 2);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function initReveal(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting) entry.target.classList.add("active");
    });
  });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

loadModStat("pulseevents", "pulse-mod");
loadModStat("pvpflow", "pvp-mod");
loadModStat("novapixel", "nova-mod");
refreshStatus();
setInterval(refreshStatus, 60000);
initParticles();
initReveal();

