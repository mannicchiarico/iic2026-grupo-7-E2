const PIN_SERVO_1 = 5;
const PIN_SERVO_2 = 6;
const MAX_SHU = 1800000; // Punto medio del Carolina Reaper (1,400,000 - 2,200,000)

let conectado = false;

const AJIES = [
  { nombre: "Bell Pepper (Pimiento Moro)", origen: "América", rango: "0 SHU", shuPromedio: 0 },
  { nombre: "Shishito", origen: "Japón", rango: "50 – 200 SHU", shuPromedio: 125 },
  { nombre: "Banana Pepper", origen: "Internacional", rango: "0 – 500 SHU", shuPromedio: 250 },
  { nombre: "Pimento (Pimiento Dulce)", origen: "España", rango: "100 – 500 SHU", shuPromedio: 300 },
  { nombre: "Padrón Pepper", origen: "España", rango: "500 – 2,500 SHU", shuPromedio: 1500 },
  { nombre: "Poblano Pepper", origen: "México", rango: "1,000 – 2,000 SHU", shuPromedio: 1500 },
  { nombre: "Pasilla Pepper", origen: "México", rango: "1,000 – 2,500 SHU", shuPromedio: 1750 },
  { nombre: "Espelette Pepper", origen: "Francia", rango: "1,500 – 4,000 SHU", shuPromedio: 2750 },
  { nombre: "Guajillo Pepper", origen: "México", rango: "2,500 – 5,000 SHU", shuPromedio: 3750 },
  { nombre: "Jalapeño", origen: "México", rango: "2,500 – 8,000 SHU", shuPromedio: 5250 },
  { nombre: "Chipotle", origen: "México", rango: "2,500 – 8,000 SHU", shuPromedio: 5250 },
  { nombre: "Serrano Pepper", origen: "México", rango: "10,000 – 23,000 SHU", shuPromedio: 16500 },
  { nombre: "Chile de Árbol", origen: "México", rango: "15,000 – 30,000 SHU", shuPromedio: 22500 },
  { nombre: "Calabrian Chili", origen: "Italia", rango: "25,000 – 40,000 SHU", shuPromedio: 32500 },
  { nombre: "Ají Amarillo", origen: "Perú", rango: "30,000 – 50,000 SHU", shuPromedio: 40000 },
  { nombre: "Tabasco Pepper", origen: "México / EE.UU.", rango: "30,000 – 50,000 SHU", shuPromedio: 40000 },
  { nombre: "Cayenne Pepper", origen: "Guyana Francesa", rango: "30,000 – 50,000 SHU", shuPromedio: 40000 },
  { nombre: "Ají Charapita", origen: "Amazonía Peruana", rango: "30,000 – 50,000 SHU", shuPromedio: 40000 },
  { nombre: "Rocoto", origen: "Perú", rango: "30,000 – 100,000 SHU", shuPromedio: 65000 },
  { nombre: "Thai Chili", origen: "Tailandia", rango: "50,000 – 100,000 SHU", shuPromedio: 75000 },
  { nombre: "Chiltepin", origen: "México", rango: "50,000 – 100,000 SHU", shuPromedio: 75000 },
  { nombre: "Habanero", origen: "México", rango: "100,000 – 350,000 SHU", shuPromedio: 225000 },
  { nombre: "Scotch Bonnet", origen: "Caribe", rango: "100,000 – 350,000 SHU", shuPromedio: 225000 },
  { nombre: "Ghost Pepper (Bhut Jolokia)", origen: "India", rango: "855,000 – 1,041,427 SHU", shuPromedio: 948214 },
  { nombre: "Carolina Reaper", origen: "EE.UU.", rango: "1,400,000 – 2,200,000 SHU", shuPromedio: 1800000 }
];

// Mapeo logarítmico de SHU a velocidad de servo continuo (0 a 1500)
function calcularVelocidad(shu) {
  if (shu <= 0) return 0;
  const escala = Math.log10(shu + 1) / Math.log10(MAX_SHU + 1);
  return Math.round(escala * 1500);
}

// Envía la misma velocidad a ambos motores (Pines 5 y 6)
function moverMotores(velocidad) {
  if (!conectado) return;
  Protobject.Arduino.contServoWrite({ pin: PIN_SERVO_1, value: velocidad });
  Protobject.Arduino.contServoWrite({ pin: PIN_SERVO_2, value: velocidad });
}

// Conexión Web Serial vía USB OTG
const btnConnect = document.getElementById("btnConnect");
btnConnect.addEventListener("click", async () => {
  try {
    await Protobject.Arduino.start();
    conectado = true;
    btnConnect.textContent = "✅ Arduino Conectado (Pines 5 y 6)";
    btnConnect.classList.add("connected");
    moverMotores(0);
  } catch (error) {
    alert("Error al conectar USB. Verifica el adaptador OTG, usa Chrome en Android y asegúrate de tener cargado el firmware de Protobject en el Arduino.");
  }
});

// Construcción dinámica de la lista táctil (25 variedades)
const contenedor = document.getElementById("menuAjies");
AJIES.forEach((aji) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "aji-btn";
  btn.innerHTML = `
    <div class="aji-info">
      <span>${aji.nombre}</span>
      <span class="aji-origen">${aji.origen}</span>
    </div>
    <span class="shu">${aji.rango}</span>
  `;

  btn.addEventListener("click", () => {
    document.querySelectorAll(".aji-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const velocidad = calcularVelocidad(aji.shuPromedio);
    document.getElementById("lblNombre").textContent = aji.nombre;
    document.getElementById("lblShu").textContent = aji.rango;
    document.getElementById("lblVel").textContent = `${velocidad} / 1500`;

    moverMotores(velocidad);
  });

  contenedor.appendChild(btn);
});

// Botón de paro de emergencia
document.getElementById("btnStop").addEventListener("click", () => {
  document.querySelectorAll(".aji-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("lblNombre").textContent = "Detenido";
  document.getElementById("lblShu").textContent = "0 SHU";
  document.getElementById("lblVel").textContent = "0 / 1500";
  moverMotores(0);
});