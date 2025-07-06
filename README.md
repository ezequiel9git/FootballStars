# ⚽ FootballStars

FootballStars es un juego web de fútbol por turnos donde dos jugadores seleccionan equipos y compiten lanzando dados para simular jugadas, goles, córners y más. El objetivo es sumar goles y vivir la emoción de un partido con reglas simples y dinámicas.

## 🚀 Demo

¡Próximamente!

## 🖥️ Características

- Selección de equipos reales y ficticios (FC Barcelona, Real Madrid CF, Crystal FC, Darkness FC).
- Tablero visual con cartas de jugadores y escudos personalizados.
- Sistema de turnos y jugadas basado en tiradas de dados.
- Eventos especiales: córner, falta, saque de banda, gol.
- Animaciones de confeti al marcar gol.
- Narración en tiempo real de las jugadas.
- Interfaz responsiva y atractiva con Tailwind CSS.

## 📸 Capturas de pantalla



## 🏗️ Estructura del proyecto

```
FutbolStars/
├── public/
│   ├── shields/         # Escudos de equipos
│   ├── cards/           # Imágenes de cartas de jugadores
│   ├── dice/            # Imágenes de dados y eventos
│   └── fondos/          # Fondos de pantalla
├── src/
│   ├── components/      # Componentes React (GameBoard, SelectTeam, etc.)
│   ├── context/         # Contexto global y datos de jugadores
│   ├── data/            # Reglas, tipos de cartas, equipos
│   ├── utils/           # Utilidades (ej: tirada de dados)
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── index.html
├── tailwind.config.js
└── package.json
```

## ⚙️ Instalación y uso

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/tuusuario/FootballStars.git
   cd FutbolStars
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Inicia la aplicación en modo desarrollo:**
   ```sh
   npm run dev
   ```

4. **Abre en tu navegador:**
   ```
   http://localhost:5173
   ```

## 📝 Cómo jugar

1. Selecciona dos equipos distintos (local y visitante).
2. Haz clic en el dado para realizar jugadas.
3. Sigue la narración y observa los eventos especiales (goles, córners, faltas).
4. El primer equipo en alcanzar 5 goles gana el partido.

## 🛠️ Tecnologías utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/) (con reglas para React)

## 📦 Scripts útiles

- `npm run dev` — Inicia el servidor de desarrollo.
- `npm run build` — Genera la versión de producción.
- `npm run preview` — Previsualiza la build.
- `npm run lint` — Ejecuta el linter.


## 📄 Licencia

---

Desarrollado con ❤️ por Ezequiel Parrado.
```
