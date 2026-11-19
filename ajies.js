// =====================================================================
//  Atlas del Picor — datos compartidos (servidor, panel y escáner)
//  Cada ají tiene su tarjeta ArUco (diccionario 4x4_50, IDs 0–24: las mismas
//  imágenes de la carpeta arucos/ del repo infovistest).
//  El campo "aruco" es el mapeo inicial; desde el panel se puede reasignar
//  (queda guardado en datos/mapeo_aruco.json).
// =====================================================================

const MAX_SHU = 1800000;
const ARUCO_DETENER = 49; // Marcador especial: detiene y centra el motor

const AJIES = [
  { aruco: 0,  id: "bell-pepper",  nombre: "Pimiento morrón", origen: "América",          rangoShu: "0 SHU",                     shu: 0 },
  { aruco: 1,  id: "shishito",     nombre: "Shishito",                      origen: "Japón",            rangoShu: "50 – 200 SHU",              shu: 125 },
  { aruco: 2,  id: "banana",       nombre: "Banana Pepper",                 origen: "Internacional",    rangoShu: "0 – 500 SHU",               shu: 250 },
  { aruco: 3,  id: "pimento",      nombre: "Pimiento dulce",      origen: "España",           rangoShu: "100 – 500 SHU",             shu: 300 },
  { aruco: 4,  id: "padron",       nombre: "Padrón",                 origen: "España",           rangoShu: "500 – 2,500 SHU",           shu: 1500 },
  { aruco: 5,  id: "poblano",      nombre: "Poblano",                origen: "México",           rangoShu: "1,000 – 2,000 SHU",         shu: 1500 },
  { aruco: 6,  id: "pasilla",      nombre: "Pasilla",                origen: "México",           rangoShu: "1,000 – 2,500 SHU",         shu: 1750 },
  { aruco: 7,  id: "espelette",    nombre: "Espelette",              origen: "Francia",          rangoShu: "1,500 – 4,000 SHU",         shu: 2750 },
  { aruco: 8,  id: "guajillo",     nombre: "Guajillo",               origen: "México",           rangoShu: "2,500 – 5,000 SHU",         shu: 3750 },
  { aruco: 9,  id: "jalapeno",     nombre: "Jalapeño",                      origen: "México",           rangoShu: "2,500 – 8,000 SHU",         shu: 5250 },
  { aruco: 10, id: "chipotle",     nombre: "Chipotle",                      origen: "México",           rangoShu: "2,500 – 8,000 SHU",         shu: 5250 },
  { aruco: 11, id: "serrano",      nombre: "Serrano",                origen: "México",           rangoShu: "10,000 – 23,000 SHU",       shu: 16500 },
  { aruco: 12, id: "arbol",        nombre: "Chile de árbol",                origen: "México",           rangoShu: "15,000 – 30,000 SHU",       shu: 22500 },
  { aruco: 13, id: "calabrian",    nombre: "Calabrés",               origen: "Italia",           rangoShu: "25,000 – 40,000 SHU",       shu: 32500 },
  { aruco: 14, id: "aji-amarillo", nombre: "Ají amarillo",                  origen: "Perú",             rangoShu: "30,000 – 50,000 SHU",       shu: 40000 },
  { aruco: 15, id: "tabasco",      nombre: "Tabasco",                origen: "México / EE.UU.",  rangoShu: "30,000 – 50,000 SHU",       shu: 40000 },
  { aruco: 16, id: "cayenne",      nombre: "Cayena",                origen: "Guyana Francesa",  rangoShu: "30,000 – 50,000 SHU",       shu: 40000 },
  { aruco: 17, id: "charapita",    nombre: "Ají charapita",                 origen: "Amazonía Peruana", rangoShu: "30,000 – 50,000 SHU",       shu: 40000 },
  { aruco: 18, id: "rocoto",       nombre: "Rocoto",                        origen: "Perú",             rangoShu: "30,000 – 100,000 SHU",      shu: 65000 },
  { aruco: 19, id: "thai",         nombre: "Thai Chili",                    origen: "Tailandia",        rangoShu: "50,000 – 100,000 SHU",      shu: 75000 },
  { aruco: 20, id: "chiltepin",    nombre: "Chiltepín",                     origen: "México",           rangoShu: "50,000 – 100,000 SHU",      shu: 75000 },
  { aruco: 21, id: "habanero",     nombre: "Habanero",                      origen: "México",           rangoShu: "100,000 – 350,000 SHU",     shu: 225000 },
  { aruco: 22, id: "scotch-bonnet", nombre: "Scotch Bonnet",                 origen: "Caribe",           rangoShu: "100,000 – 350,000 SHU",     shu: 225000 },
  { aruco: 23, id: "ghost",        nombre: "Ghost Pepper",   origen: "India",            rangoShu: "855,000 – 1,041,427 SHU",   shu: 948214 },
  { aruco: 24, id: "reaper",       nombre: "Carolina Reaper",               origen: "EE.UU.",           rangoShu: "1,400,000 – 2,200,000 SHU", shu: 1800000 }
];

// Contrato del grupo (mismo cálculo que la página del teléfono con WebUSB):
// nivel = round(10 · log10(SHU + 1) / log10(SHU_max + 1)), limitado a 0–10.
// 0 SHU → nivel 0 (sin movimiento); Carolina Reaper → nivel 10
function calcularNivel(shu) {
  const nivel = Math.round(10 * Math.log10(shu + 1) / Math.log10(MAX_SHU + 1));
  return Math.max(0, Math.min(10, nivel));
}

function ajiPorAruco(n) { return AJIES.find(a => a.aruco === n) || null; }
function ajiPorId(id)   { return AJIES.find(a => a.id === id) || null; }

if (typeof module !== "undefined" && module.exports) {
  module.exports = { AJIES, MAX_SHU, ARUCO_DETENER, calcularNivel, ajiPorAruco, ajiPorId };
}
