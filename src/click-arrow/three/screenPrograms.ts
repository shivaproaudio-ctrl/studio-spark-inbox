export type ScreenProgramType =
  | 'brand-identity'
  | 'social-presence'
  | 'search-growth'
  | 'digital-experiences'
  | 'visual-stories'
  | 'ai-marketing';

const BRAND_RED = '#E80012';
const BRAND_BLACK = '#050505';
const BRAND_WHITE = '#FFFFFF';

/**
 * Draws a crisp geometric Click Arrow chevron on a 2D canvas.
 */
function drawArrowMark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  rotation = 0,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-size * 0.55, -size * 0.55);
  ctx.lineTo(size * 0.15, -size * 0.55);
  ctx.lineTo(size * 0.65, 0);
  ctx.lineTo(size * 0.15, size * 0.55);
  ctx.lineTo(-size * 0.55, size * 0.55);
  ctx.lineTo(-size * 0.05, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Renders 6 distinct, high-contrast CRT motion graphic channels strictly in
 * Click Arrow's Red (#E80012), Black (#050505), and White (#FFFFFF).
 */
export function renderScreenProgram(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  program: ScreenProgramType,
  time: number,
  backdropImg?: HTMLImageElement | null,
) {
  ctx.save();

  // Deep pitch-black phosphor base
  ctx.fillStyle = BRAND_BLACK;
  ctx.fillRect(0, 0, width, height);

  // Optional subtle monochrome/red-tinted studio image underlayer when provided
  if (backdropImg && backdropImg.complete && backdropImg.naturalWidth > 0) {
    ctx.save();
    ctx.globalAlpha = program === 'visual-stories' ? 0.58 : 0.28;
    const imgRatio = backdropImg.naturalWidth / backdropImg.naturalHeight;
    const canvasRatio = width / height;
    let drawW = width;
    let drawH = height;
    let dx = 0;
    let dy = 0;
    if (imgRatio > canvasRatio) {
      drawW = height * imgRatio;
      dx = (width - drawW) * 0.5;
    } else {
      drawH = width / imgRatio;
      dy = (height - drawH) * 0.5;
    }
    const pan = Math.sin(time * 0.45) * 8;
    ctx.drawImage(backdropImg, dx + pan, dy, drawW, drawH);
    ctx.restore();

    // Red/black contrast wash
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(5, 5, 5, 0.72)');
    grad.addColorStop(0.55, 'rgba(232, 0, 18, 0.25)');
    grad.addColorStop(1, 'rgba(5, 5, 5, 0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // Channel-specific live motion graphics
  switch (program) {
    case 'brand-identity': {
      // Bold Swiss grid + rotating & stepping Click Arrow monograms
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1;
      const cols = 6;
      const rows = 4;
      for (let c = 1; c < cols; c++) {
        const x = (width / cols) * c;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let r = 1; r < rows; r++) {
        const y = (height / rows) * r;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vivid red pulse plate
      const sweep = ((time * 0.5) % 1) * width;
      ctx.fillStyle = BRAND_RED;
      ctx.fillRect(0, height * 0.34, width, height * 0.32);

      // Kinetic white arrow marching across red band
      for (let i = -1; i < 4; i++) {
        const ax = ((sweep + i * (width * 0.34)) % (width * 1.35)) - width * 0.18;
        drawArrowMark(ctx, ax, height * 0.5, height * 0.2, BRAND_WHITE, 0);
      }

      // Editorial title bars
      ctx.fillStyle = BRAND_WHITE;
      ctx.font = `700 ${Math.round(height * 0.085)}px "Bricolage Grotesque", sans-serif`;
      ctx.fillText('IDENTITY SYSTEM', width * 0.07, height * 0.22);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = `500 ${Math.round(height * 0.048)}px "IBM Plex Mono", monospace`;
      ctx.fillText('CH 01 · MARKS · TYPE · MOTION', width * 0.07, height * 0.84);
      break;
    }

    case 'social-presence': {
      // Triple vertical reel frames sliding continuously
      const cardW = width * 0.24;
      const cardH = height * 0.62;
      const gap = width * 0.05;
      const totalSpan = (cardW + gap) * 4;
      const scrollX = (time * 52) % totalSpan;

      for (let i = 0; i < 6; i++) {
        const x = width - ((scrollX + i * (cardW + gap)) % (totalSpan * 1.5)) + cardW * 0.4;
        const y = height * 0.19 + Math.sin(time * 2 + i) * 6;
        const isRed = i % 2 === 0;

        ctx.fillStyle = isRed ? BRAND_RED : '#111111';
        ctx.fillRect(x, y, cardW, cardH);
        ctx.strokeStyle = BRAND_WHITE;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cardW, cardH);

        drawArrowMark(
          ctx,
          x + cardW * 0.5,
          y + cardH * 0.44,
          cardW * 0.34,
          BRAND_WHITE,
          Math.sin(time + i) * 0.15,
        );

        ctx.fillStyle = BRAND_WHITE;
        ctx.fillRect(x + cardW * 0.15, y + cardH * 0.76, cardW * 0.7, 3);
        ctx.fillRect(x + cardW * 0.15, y + cardH * 0.84, cardW * 0.45, 3);
      }

      ctx.fillStyle = BRAND_WHITE;
      ctx.font = `700 ${Math.round(height * 0.07)}px "Bricolage Grotesque", sans-serif`;
      ctx.fillText('SOCIAL VELOCITY', width * 0.06, height * 0.13);
      break;
    }

    case 'search-growth': {
      // Architectural vector bar spectrum + sweeping radar line
      const bars = 14;
      const startX = width * 0.08;
      const barSpan = (width * 0.84) / bars;
      for (let i = 0; i < bars; i++) {
        const wave = 0.28 + 0.55 * Math.abs(Math.sin(time * 1.8 + i * 0.45));
        const bh = height * 0.5 * wave;
        const bx = startX + i * barSpan;
        const by = height * 0.78 - bh;
        ctx.fillStyle = i % 3 === 0 ? BRAND_RED : BRAND_WHITE;
        ctx.fillRect(bx, by, barSpan * 0.62, bh);
      }

      // Rising curve line
      ctx.strokeStyle = BRAND_RED;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const nx = x / width;
        const py =
          height * 0.68 -
          nx * height * 0.36 -
          Math.sin(nx * 6 - time * 2.4) * height * 0.06;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();

      ctx.fillStyle = BRAND_WHITE;
      ctx.font = `700 ${Math.round(height * 0.075)}px "Bricolage Grotesque", sans-serif`;
      ctx.fillText('SEARCH & GROWTH', width * 0.08, height * 0.18);
      ctx.fillStyle = BRAND_RED;
      ctx.fillRect(width * 0.08, height * 0.84, width * 0.84, 2);
      break;
    }

    case 'digital-experiences': {
      // Layered interactive UI viewport wireframes sliding in 3D perspective
      for (let layer = 0; layer < 3; layer++) {
        const phase = (time * 0.55 + layer * 0.33) % 1;
        const scale = 0.55 + phase * 0.45;
        const boxW = width * 0.68 * scale;
        const boxH = height * 0.56 * scale;
        const bx = (width - boxW) * 0.5;
        const by = (height - boxH) * 0.5 + 8;

        ctx.strokeStyle = layer === 1 ? BRAND_RED : 'rgba(255,255,255,0.85)';
        ctx.lineWidth = layer === 1 ? 3 : 1.5;
        ctx.strokeRect(bx, by, boxW, boxH);

        // Top window bar
        ctx.fillStyle = layer === 1 ? BRAND_RED : BRAND_WHITE;
        ctx.fillRect(bx, by, boxW, Math.max(4, boxH * 0.09));
      }

      drawArrowMark(
        ctx,
        width * 0.5 + Math.cos(time * 1.4) * width * 0.16,
        height * 0.52 + Math.sin(time * 1.9) * height * 0.08,
        height * 0.15,
        BRAND_WHITE,
        0,
      );

      ctx.fillStyle = BRAND_WHITE;
      ctx.font = `600 ${Math.round(height * 0.055)}px "IBM Plex Mono", monospace`;
      ctx.fillText('INTERACTIVE WEB FLAGSHIPS', width * 0.07, height * 0.14);
      break;
    }

    case 'visual-stories': {
      // Cinema letterbox framing, moving aperture crosshairs & live timecode
      const barH = height * 0.12;
      ctx.fillStyle = BRAND_BLACK;
      ctx.fillRect(0, 0, width, barH);
      ctx.fillRect(0, height - barH, width, barH);

      // Center kinetic red aperture frame
      const frameW = width * 0.72;
      const frameH = height * 0.52;
      const fx = (width - frameW) * 0.5;
      const fy = (height - frameH) * 0.5;
      ctx.strokeStyle = BRAND_WHITE;
      ctx.lineWidth = 2;
      ctx.strokeRect(fx, fy, frameW, frameH);

      // Corner red brackets
      const b = 18;
      ctx.strokeStyle = BRAND_RED;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fx, fy + b);
      ctx.lineTo(fx, fy);
      ctx.lineTo(fx + b, fy);
      ctx.moveTo(fx + frameW - b, fy);
      ctx.lineTo(fx + frameW, fy);
      ctx.lineTo(fx + frameW, fy + b);
      ctx.moveTo(fx, fy + frameH - b);
      ctx.lineTo(fx, fy + frameH);
      ctx.lineTo(fx + b, fy + frameH);
      ctx.moveTo(fx + frameW - b, fy + frameH);
      ctx.lineTo(fx + frameW, fy + frameH);
      ctx.lineTo(fx + frameW, fy + frameH - b);
      ctx.stroke();

      // Dynamic oscilloscope waveform
      ctx.strokeStyle = BRAND_WHITE;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = fx + 12; x < fx + frameW - 12; x += 6) {
        const t = (x - fx) / frameW;
        const amp = Math.sin(t * 24 + time * 5) * Math.sin(t * Math.PI) * (frameH * 0.24);
        const y = height * 0.5 + amp;
        if (x === fx + 12) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const sec = Math.floor(time) % 60;
      const frm = Math.floor((time * 24) % 24);
      ctx.fillStyle = BRAND_WHITE;
      ctx.font = `600 ${Math.round(height * 0.05)}px "IBM Plex Mono", monospace`;
      ctx.fillText(
        `CAM A · 24FPS · 00:00:${String(sec).padStart(2, '0')}:${String(frm).padStart(2, '0')}`,
        width * 0.07,
        height * 0.94,
      );
      break;
    }

    case 'ai-marketing': {
      // Matrix of pulsing signal nodes connected by sharp red vector edges
      const cols = 7;
      const rows = 4;
      const padX = width * 0.14;
      const padY = height * 0.24;
      const stepX = (width - padX * 2) / (cols - 1);
      const stepY = (height - padY * 2) / (rows - 1);

      // Connecting signal lines
      ctx.strokeStyle = 'rgba(232, 0, 18, 0.72)';
      ctx.lineWidth = 1.5;
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const px = padX + c * stepX;
          const py =
            padY + r * stepY + Math.sin(time * 2.2 + c * 0.8 + r) * 7;
          if (c === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Nodes
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = padX + c * stepX;
          const py =
            padY + r * stepY + Math.sin(time * 2.2 + c * 0.8 + r) * 7;
          const active = Math.sin(time * 3 + c * 1.1 + r * 0.7) > 0.35;
          ctx.fillStyle = active ? BRAND_RED : BRAND_WHITE;
          ctx.beginPath();
          ctx.arc(px, py, active ? 5.5 : 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = BRAND_WHITE;
      ctx.font = `700 ${Math.round(height * 0.07)}px "Bricolage Grotesque", sans-serif`;
      ctx.fillText('INTELLIGENT WORKFLOWS', width * 0.07, height * 0.14);
      break;
    }
  }

  // CRT scanline & glass reflection pass (strictly black & white)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 1.5);
  }

  // Subtle curved top-left glass specular sheen
  const sheen = ctx.createLinearGradient(0, 0, width * 0.65, height * 0.65);
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
  sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.02)');
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.32)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}
