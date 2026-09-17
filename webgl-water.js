// ============================================
//  WEBGL-ВОДА — с яркими бликами и мягким курсором
// ============================================

(function() {
    const canvas = document.getElementById('waterCanvas');
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        document.querySelector('.pool-fallback').classList.add('active');
        console.warn('WebGL не поддерживается');
        return;
    }
    
    const vertexShaderSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        
        void main() {
            v_uv = (a_position + 1.0) * 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;
    
    const fragmentShaderSource = `
        precision mediump float;
        
        varying vec2 v_uv;
        
        uniform sampler2D u_tiles;
        uniform sampler2D u_normal1;
        uniform sampler2D u_normal2;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform vec2 u_resolution;
        
        void main() {
            vec2 uv = v_uv;
            vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
            vec2 tileUV = uv * aspect;
            
            // ===== ПЛАВНОЕ КОЛЫХАНИЕ =====
            vec2 uv1 = tileUV * 1.2;
            uv1.x += u_time * 0.002;
            uv1.y += u_time * 0.0015;
            vec3 normal1 = (texture2D(u_normal1, uv1).rgb * 2.0 - 1.0) * 0.5;
            
            vec2 uv2 = tileUV * 1.8;
            uv2.x -= u_time * 0.0025;
            uv2.y += u_time * 0.0018;
            vec3 normal2 = (texture2D(u_normal2, uv2).rgb * 2.0 - 1.0) * 0.5;
            
            // ===== ВОЛНА ОТ КУРСОРА =====
            vec2 toMouse = uv - u_mouse;
            toMouse.x *= aspect.x;
            float distToMouse = length(toMouse);
            
            float ring = sin(distToMouse * 20.0 - u_time * 2.5) * 0.5 + 0.5;
            float ringFalloff = smoothstep(0.35, 0.0, distToMouse);
            float mouseWave = ring * ringFalloff * 0.08;
            
            // ===== ИСКАЖЕНИЕ ПЛИТКИ =====
            vec2 distortion = normal1.xy * 0.06 + normal2.xy * 0.04;
            vec2 mouseDir = normalize(toMouse + 0.001);
            distortion += mouseDir * mouseWave;
            
            vec2 distortedUV = tileUV + distortion;
            distortedUV *= 2.5;
            
            vec3 tileColor = texture2D(u_tiles, distortedUV).rgb;
            
            // ===== БАЗОВЫЙ ЦВЕТ ВОДЫ =====
            vec3 waterTint = vec3(0.2, 0.6, 0.85);
            vec3 tintedTiles = tileColor * waterTint;
            vec3 finalColor = tintedTiles * 0.85;
            
            // ===== КАУСТИКА — УСИЛЕННАЯ =====
            float causticA = max(0.0, normal1.z) * max(0.0, normal1.x + normal1.y);
            float causticB = max(0.0, normal2.z) * max(0.0, normal2.x + normal2.y);
            float caustic = (causticA + causticB);
            
            // Усилили с 1.2 до 1.6 — блики ярче
            caustic = pow(caustic, 0.7) * 1.6;
            caustic = clamp(caustic, 0.0, 1.0);
            
            // Светлые бирюзовые полосы
            finalColor += vec3(caustic * 0.55, caustic * 0.75, caustic * 0.85);
            
            // ===== БЛИКИ (белые точки) — УСИЛЕННЫЕ =====
            float sparkle1 = pow(max(0.0, normal1.z), 10.0);
            float sparkle2 = pow(max(0.0, normal2.z), 10.0);
            // Было 0.7, стало 1.0 — ярче
            float sparkle = (sparkle1 + sparkle2) * 1.0;
            
            finalColor += vec3(sparkle, sparkle, sparkle);
            
            // ===== КУРСОР-ФОНАРИК (МЯГКИЙ) =====
            // Было 0.8, стало 0.4 — вдвое мягче
            float mouseGlow = ringFalloff * 0.4;
            finalColor += vec3(mouseGlow * 0.4, mouseGlow * 0.55, mouseGlow * 0.7);
            
            // Ядро фонарика — было 0.6, стало 0.25
            float coreGlow = smoothstep(0.12, 0.0, distToMouse) * 0.25;
            finalColor += vec3(coreGlow * 0.6, coreGlow * 0.8, coreGlow * 1.0);
            
            // ===== ВИНЬЕТКА =====
            vec2 vignetteUV = uv * (1.0 - uv.yx);
            float vignette = pow(vignetteUV.x * vignetteUV.y * 12.0, 0.35);
            finalColor *= mix(0.35, 1.0, vignette);
            
            finalColor = clamp(finalColor, 0.0, 1.0);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Ошибка шейдера:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Ошибка линковки:', gl.getProgramInfoLog(program));
        document.querySelector('.pool-fallback').classList.add('active');
        return;
    }
    
    gl.useProgram(program);
    
    const positions = new Float32Array([
        -1, -1,  1, -1, -1, 1,
        -1,  1,  1, -1,  1, 1,
    ]);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    const uniforms = {
        time: gl.getUniformLocation(program, 'u_time'),
        mouse: gl.getUniformLocation(program, 'u_mouse'),
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        tiles: gl.getUniformLocation(program, 'u_tiles'),
        normal1: gl.getUniformLocation(program, 'u_normal1'),
        normal2: gl.getUniformLocation(program, 'u_normal2'),
    };
    
    function loadTexture(url, unit, uniformLocation) {
        return new Promise((resolve) => {
            const texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([128, 128, 128, 255]));
            
            const image = new Image();
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.uniform1i(uniformLocation, unit);
                console.log('✅ Загружена текстура:', url);
                resolve(true);
            };
            image.onerror = () => {
                console.warn('❌ Не загрузилась текстура:', url);
                resolve(false);
            };
            image.src = url;
        });
    }
    
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.resolution, w, h);
    }
    
    window.addEventListener('resize', resize);
    
    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX / window.innerWidth;
        mouse.targetY = 1.0 - e.clientY / window.innerHeight;
    });
    
    window.addEventListener('touchmove', (e) => {
        if (e.touches[0]) {
            mouse.targetX = e.touches[0].clientX / window.innerWidth;
            mouse.targetY = 1.0 - e.touches[0].clientY / window.innerHeight;
        }
    }, { passive: true });
    
    resize();
    
    Promise.all([
        loadTexture('images/pool-tiles.png', 0, uniforms.tiles),
        loadTexture('images/water-normal1.jpg', 1, uniforms.normal1),
        loadTexture('images/water-normal2.jpg', 2, uniforms.normal2),
    ]).then(() => {
        console.log('✅ WebGL-вода загружена');
        animate();
    });
    
    const startTime = Date.now();
    
    function animate() {
        const time = (Date.now() - startTime) / 1000;
        
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        
        gl.uniform1f(uniforms.time, time);
        gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        requestAnimationFrame(animate);
    }
})();