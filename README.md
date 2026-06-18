# Calculadora de Ahorro Cambiario (USD ⇄ VES)

Una aplicación web estética, minimalista y ultra-rápida para calcular la diferencia de conversión y el ahorro real al pagar impuestos o trámites en Venezuela.

La brecha entre la tasa de cambio oficial (Banco Central de Venezuela / Banco de interés oficial) y la tasa informal (Dólar paralelo o de calle) genera una oportunidad de optimización de capital que esta app calcula al instante.

## 🚀 Características

- **Diseño Premium**: Interfaz moderna con efectos de glassmorphism, esquemas de colores HSL elegantes y tipografía de alta definición ("Plus Jakarta Sans" y "Space Grotesk").
- **Modo Oscuro / Claro**: Cambia de tema con un solo clic con transiciones suaves.
- **Cálculo en Tiempo Real**: Los resultados se actualizan inmediatamente a medida que escribes, sin necesidad de pulsar un botón de "calcular".
- **Visualización Gráfica**: Una barra de progreso interactiva te muestra en color azul lo que estás gastando realmente y en verde el ahorro directo que conservas.
- **Memoria de Datos**: Guarda automáticamente los últimos tipos de cambio que ingresaste mediante `localStorage`, de modo que no tienes que reescribirlos cada vez que abres la app.

## 📊 Fórmulas de Cálculo

- **Bolívares a Pagar**: 
  $$\text{Bs. a Pagar} = \text{Impuesto USD} \times \text{Dólar Oficial (Banco)}$$
- **Dólares Reales Gastados**: 
  $$\text{USD Reales} = \frac{\text{Bs. a Pagar}}{\text{Dólar Calle}}$$
- **Ahorro Directo (USD)**: 
  $$\text{Ahorro USD} = \text{Impuesto USD} - \text{USD Reales}$$
- **Ahorro Equiv. (VES)**: 
  $$\text{Ahorro VES} = \text{Ahorro USD} \times \text{Dólar Calle}$$
- **Porcentaje de Ahorro**: 
  $$\% \text{ Ahorro} = \left( 1 - \frac{\text{Dólar Oficial}}{\text{Dólar Calle}} \right) \times 100$$

## 🛠️ Cómo Ejecutar Localmente

Dado que esta es una aplicación web SPA estática (HTML/CSS/JS nativo), puedes ejecutarla de las siguientes formas:

1. **Doble clic en `index.html`**: Simplemente abre el archivo directamente en tu navegador web preferido (Chrome, Safari, Firefox, Edge, etc.).
2. **Servidor Local (Recomendado)**: Si utilizas VS Code, puedes usar la extensión **Live Server** para levantar un servidor web local en un clic, o ejecutar con `python -m http.server` o `npx serve`.
3. **Con Docker 🐳**:
   Si tienes Docker instalado y en ejecución, puedes levantar la aplicación en un contenedor de Nginx ejecutando:
   ```bash
   docker compose up --build -d
   ```
   Luego, abre tu navegador e ingresa a `http://localhost:8080` para usar la aplicación.

---

Creado con precisión matemática y enfoque en experiencia de usuario.
