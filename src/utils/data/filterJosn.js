import json from "./argentinianCites.json" assert { type: "json" };

/* CODIGO PARA CREAR ARCHIVO Y SECCIONAR EN DISTINTAS PROVINCIAS/JSON */
import fs from "fs"; // Módulo de sistema de archivos en Node.js
import path from "path";
import { fileURLToPath } from "url"; // Importar la función fileURLToPath

let result1 = json.items.filter((city) => city.province_id === 13);

const convertirPalabras = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");


let result = result1.map((result) => {
  let newName = convertirPalabras(result.name);
  return { ...result, name: newName };
});

// Crear un nuevo objeto JSON con los resultados
let newJson = {
  items: result,
};

// Convertir el objeto a formato JSON
let jsonString = JSON.stringify(newJson, null, 2); // El tercer parámetro (2) es para dar formato con sangrías de 2 espacios

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Especificar la ruta y nombre del nuevo archivo JSON
let newFilePath = path.join(__dirname, "filteredMendozaCities.json");

// Escribir el nuevo archivo JSON
fs.writeFileSync(newFilePath, jsonString);


