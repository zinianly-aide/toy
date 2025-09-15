// canvas-functions.js - 包含所有Canvas相关的函数

// 简介部分的Canvas
function initIntroCanvas() {
    const canvas = document.getElementById('introCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawIntro();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function drawIntro() {
        const w = canvas.width;
        const h = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        
        // 绘制网格
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // 水平线
        for (let i = 0; i < 5; i++) {
            const y = h * 0.1 + i * h * 0.2;
            ctx.beginPath();
            ctx.moveTo(w * 0.1, y);
            ctx.lineTo(w * 0.9, y);
            ctx.stroke();
        }
        
        // 垂直线
        for (let i = 0; i < 5; i++) {
            const x = w * 0.1 + i * w * 0.2;
            ctx.beginPath();
            ctx.moveTo(x, h * 0.1);
            ctx.lineTo(x, h * 0.9);
            ctx.stroke();
        }
        
        // 绘制坐标轴
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.5);
        ctx.lineTo(w * 0.9, h * 0.5);
        ctx.moveTo(w * 0.5, h * 0.1);
        ctx.lineTo(w * 0.5, h * 0.9);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 绘制导数部分 - 曲线和切线
        ctx.beginPath();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        // 绘制曲线
        for (let x = w * 0.2; x <= w * 0.4; x += 1) {
            const t = (x - w * 0.2) / (w * 0.2);
            const y = h * 0.7 - Math.pow(t, 2) * h * 0.4;
            
            if (x === w * 0.2) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 绘制切线
        const tangentX = w * 0.3;
        const tangentY = h * 0.6;
        const tangentSlope = 0.5;
        
        ctx.beginPath();
        ctx.moveTo(tangentX - 20, tangentY - 20 * tangentSlope);
        ctx.lineTo(tangentX + 20, tangentY + 20 * tangentSlope);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制切点
        ctx.beginPath();
        ctx.arc(tangentX, tangentY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.fill();
        
        // 绘制积分部分 - 矩形近似
        const integralStartX = w * 0.6;
        const integralEndX = w * 0.8;
        const integralY = h * 0.3;
        const rectWidth = (integralEndX - integralStartX) / 5;
        
        // 绘制曲线
        ctx.beginPath();
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2;
        
        for (let x = integralStartX; x <= integralEndX; x += 1) {
            const t = (x - integralStartX) / (integralEndX - integralStartX);
            const y = h * 0.7 - (0.5 + 0.5 * Math.sin(t * Math.PI * 2)) * h * 0.4;
            
            if (x === integralStartX) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 绘制矩形
        for (let i = 0; i < 5; i++) {
            const rectX = integralStartX + i * rectWidth;
            const rectHeight = (h * 0.7 - (0.5 + 0.5 * Math.sin((i + 0.5) / 5 * Math.PI * 2)) * h * 0.4) - h * 0.7;
            
            ctx.fillStyle = 'rgba(124, 58, 237, 0.3)';
            ctx.fillRect(rectX, h * 0.7, rectWidth, rectHeight);
            
            ctx.strokeStyle = 'rgba(124, 58, 237, 0.6)';
            ctx.lineWidth = 1;
            ctx.strokeRect(rectX, h * 0.7, rectWidth, rectHeight);
        }
        
        // 文字说明
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        // 导数标题
        ctx.fillText('导数: 变化率', w * 0.3, h * 0.15);
        
        // 积分标题
        ctx.fillText('积分: 累积和', w * 0.7, h * 0.15);
        
        // 微积分符号
        ctx.font = '24px STIX Two Math, serif';
        ctx.fillText('d/dx', w * 0.3, h * 0.85);
        ctx.fillText('∫', w * 0.7, h * 0.85);
    }
}

// 导数部分的Canvas
function initDerivativeCanvas() {
    const canvas = document.getElementById('derivativeCanvas');
    const ctx = canvas.getContext('2d');
    
    // 预定义的函数
    const functions = [
        { name: 'f(x) = x²', func: x => x * x / 20, derivative: x => x / 10 },
        { name: 'f(x) = sin(x)', func: x => Math.sin(x / 10) * 40, derivative: x => Math.cos(x / 10) * 4 },
        { name: 'f(x) = e^x/10', func: x => Math.exp(x / 20) * 3, derivative: x => Math.exp(x / 20) * 0.15 },
        { name: 'f(x) = ln(x+10)', func: x => Math.log(x / 5 + 10) * 15, derivative: x => 15 / (x / 5 + 10) * 0.2 },
        { name: 'f(x) = |x|', func: x => Math.abs(x) / 2, derivative: x => x >= 0 ? 0.5 : -0.5 }
    ];
    
    let currentFuncIndex = 0;
    let currentFunc = functions[currentFuncIndex];
    let currentX = 0;
    let isDragging = false;
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawDerivative();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 切换函数
    document.getElementById('prevFunc').addEventListener('click', () => {
        currentFuncIndex = (currentFuncIndex - 1 + functions.length) % functions.length;
        currentFunc = functions[currentFuncIndex];
        drawDerivative();
    });
    
    document.getElementById('nextFunc').addEventListener('click', () => {
        currentFuncIndex = (currentFuncIndex + 1) % functions.length;
        currentFunc = functions[currentFuncIndex];
        drawDerivative();
    });
    
    // 鼠标事件
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否点击了点
        const pointX = mapXToScreen(currentX);
        const pointY = mapYToScreen(currentFunc.func(currentX));
        const distance = Math.hypot(x - pointX, y - pointY);
        
        if (distance < 10) {
            isDragging = true;
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            currentX = mapXToDomain(x);
            drawDerivative();
        }
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // 触摸事件
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        // 检查是否点击了点
        const pointX = mapXToScreen(currentX);
        const pointY = mapYToScreen(currentFunc.func(currentX));
        const distance = Math.hypot(x - pointX, y - pointY);
        
        if (distance < 10) {
            isDragging = true;
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            currentX = mapXToDomain(x);
            drawDerivative();
        }
    });
    
    window.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // 坐标转换函数
    function mapXToDomain(screenX) {
        const rect = canvas.getBoundingClientRect();
        return (screenX / rect.width) * 160 - 80; // 将屏幕X映射到[-80, 80]
    }
    
    function mapXToScreen(domainX) {
        const rect = canvas.getBoundingClientRect();
        return ((domainX + 80) / 160) * rect.width;
    }
    
    function mapYToScreen(domainY) {
        const rect = canvas.getBoundingClientRect();
        return rect.height * 0.5 - domainY / 60 * rect.height * 0.35; // 映射Y值到屏幕
    }
    
    function drawDerivative() {
        const w = canvas.width;
        const h = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        
        // 绘制网格
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // 水平线
        for (let i = 0; i < 5; i++) {
            const y = h * 0.1 + i * h * 0.2;
            ctx.beginPath();
            ctx.moveTo(w * 0.1, y);
            ctx.lineTo(w * 0.9, y);
            ctx.stroke();
        }
        
        // 垂直线
        for (let i = 0; i < 5; i++) {
            const x = w * 0.1 + i * w * 0.2;
            ctx.beginPath();
            ctx.moveTo(x, h * 0.1);
            ctx.lineTo(x, h * 0.9);
            ctx.stroke();
        }
        
        // 绘制坐标轴
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.5);
        ctx.lineTo(w * 0.9, h * 0.5);
        ctx.moveTo(w * 0.5, h * 0.1);
        ctx.lineTo(w * 0.5, h * 0.9);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 绘制函数曲线
        ctx.beginPath();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        for (let x = -80; x <= 80; x += 1) {
            const y = currentFunc.func(x);
            const screenX = mapXToScreen(x);
            const screenY = mapYToScreen(y);
            
            if (x === -80) {
                ctx.moveTo(screenX, screenY);
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();
        
        // 计算当前点的导数
        const derivative = currentFunc.derivative(currentX);
        const currentY = currentFunc.func(currentX);
        
        // 计算切线的起点和终点
        const tangentLength = 50;
        const tangentStartX = currentX - tangentLength / Math.sqrt(1 + derivative * derivative);
        const tangentStartY = currentY - derivative * tangentLength / Math.sqrt(1 + derivative * derivative);
        const tangentEndX = currentX + tangentLength / Math.sqrt(1 + derivative * derivative);
        const tangentEndY = currentY + derivative * tangentLength / Math.sqrt(1 + derivative * derivative);
        
        // 绘制切线
        ctx.beginPath();
        ctx.moveTo(mapXToScreen(tangentStartX), mapYToScreen(tangentStartY));
        ctx.lineTo(mapXToScreen(tangentEndX), mapYToScreen(tangentEndY));
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制当前点
        ctx.beginPath();
        ctx.arc(mapXToScreen(currentX), mapYToScreen(currentY), 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 显示函数名称
        ctx.fillStyle = '#1e293b';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(currentFunc.name, w * 0.1, h * 0.15);
        
        // 显示当前点的导数信息
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`在 x = ${currentX.toFixed(1)} 处`, w * 0.1, h * 0.85);
        ctx.fillText(`导数 = ${derivative.toFixed(2)}`, w * 0.1, h * 0.9);
        ctx.fillText(`(切线斜率)`, w * 0.1, h * 0.95);
    }
}

// 积分部分的Canvas
function initIntegralCanvas() {
    const canvas = document.getElementById('integralCanvas');
    const ctx = canvas.getContext('2d');
    
    let n = 5; // 矩形数量
    let a = -60; // 积分下限
    let b = 60; // 积分上限
    let draggingPoint = null; // 'a' 或 'b' 或 null
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawIntegral();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 调整矩形数量
    document.getElementById('decreaseN').addEventListener('click', () => {
        n = Math.max(1, n - 1);
        document.getElementById('nValue').textContent = `分割数: ${n}`;
        drawIntegral();
    });
    
    document.getElementById('increaseN').addEventListener('click', () => {
        n = Math.min(50, n + 1);
        document.getElementById('nValue').textContent = `分割数: ${n}`;
        drawIntegral();
    });
    
    // 鼠标事件
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否点击了a点
        const aScreenX = mapXToScreen(a);
        const distanceToA = Math.hypot(x - aScreenX, y - rect.height * 0.5);
        if (distanceToA < 10) {
            draggingPoint = 'a';
            return;
        }
        
        // 检查是否点击了b点
        const bScreenX = mapXToScreen(b);
        const distanceToB = Math.hypot(x - bScreenX, y - rect.height * 0.5);
        if (distanceToB < 10) {
            draggingPoint = 'b';
            return;
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (draggingPoint) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const domainX = mapXToDomain(x);
            
            // 限制在范围内
            const minX = -80;
            const maxX = 80;
            
            if (draggingPoint === 'a') {
                a = Math.min(Math.max(domainX, minX), b - 10);
            } else if (draggingPoint === 'b') {
                b = Math.max(Math.min(domainX, maxX), a + 10);
            }
            
            drawIntegral();
        }
    });
    
    window.addEventListener('mouseup', () => {
        draggingPoint = null;
    });
    
    // 触摸事件
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        
        // 检查是否点击了a点
        const aScreenX = mapXToScreen(a);
        const distanceToA = Math.hypot(x - aScreenX, rect.height * 0.5 - rect.height * 0.5);
        if (distanceToA < 10) {
            draggingPoint = 'a';
            return;
        }
        
        // 检查是否点击了b点
        const bScreenX = mapXToScreen(b);
        const distanceToB = Math.hypot(x - bScreenX, rect.height * 0.5 - rect.height * 0.5);
        if (distanceToB < 10) {
            draggingPoint = 'b';
            return;
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (draggingPoint) {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const domainX = mapXToDomain(x);
            
            // 限制在范围内
            const minX = -80;
            const maxX = 80;
            
            if (draggingPoint === 'a') {
                a = Math.min(Math.max(domainX, minX), b - 10);
            } else if (draggingPoint === 'b') {
                b = Math.max(Math.min(domainX, maxX), a + 10);
            }
            
            drawIntegral();
        }
    });
    
    window.addEventListener('touchend', () => {
        draggingPoint = null;
    });
    
    // 坐标转换函数
    function mapXToDomain(screenX) {
        const rect = canvas.getBoundingClientRect();
        return (screenX / rect.width) * 160 - 80; // 将屏幕X映射到[-80, 80]
    }
    
    function mapXToScreen(domainX) {
        const rect = canvas.getBoundingClientRect();
        return ((domainX + 80) / 160) * rect.width;
    }
    
    function mapYToScreen(domainY) {
        const rect = canvas.getBoundingClientRect();
        return rect.height * 0.5 - (domainY / 60) * rect.height * 0.35; // 映射Y值到屏幕
    }
    
    // 被积函数
    function f(x) {
        return Math.sin(x / 20) * 30 + Math.cos(x / 30) * 15;
    }
    
    function drawIntegral() {
        const w = canvas.width;
        const h = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        
        // 绘制网格
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // 水平线
        for (let i = 0; i < 5; i++) {
            const y = h * 0.1 + i * h * 0.2;
            ctx.beginPath();
            ctx.moveTo(w * 0.1, y);
            ctx.lineTo(w * 0.9, y);
            ctx.stroke();
        }
        
        // 垂直线
        for (let i = 0; i < 5; i++) {
            const x = w * 0.1 + i * w * 0.2;
            ctx.beginPath();
            ctx.moveTo(x, h * 0.1);
            ctx.lineTo(x, h * 0.9);
            ctx.stroke();
        }
        
        // 绘制坐标轴
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.5);
        ctx.lineTo(w * 0.9, h * 0.5);
        ctx.moveTo(w * 0.5, h * 0.1);
        ctx.lineTo(w * 0.5, h * 0.9);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 绘制函数曲线
        ctx.beginPath();
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2;
        
        const step = 1;
        for (let x = -80; x <= 80; x += step) {
            const y = f(x);
            const screenX = mapXToScreen(x);
            const screenY = mapYToScreen(y);
            
            if (x === -80) {
                ctx.moveTo(screenX, screenY);
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();
        
        // 绘制积分区间
        const dx = (b - a) / n;
        let totalArea = 0;
        
        // 绘制矩形
        for (let i = 0; i < n; i++) {
            const x = a + i * dx;
            const xMid = x + dx / 2; // 中点
            const y = f(xMid);
            const area = y * dx;
            totalArea += area;
            
            // 矩形的屏幕坐标
            const rectX = mapXToScreen(x);
            const rectWidth = mapXToScreen(x + dx) - rectX;
            const rectY = mapYToScreen(0);
            const rectHeight = mapYToScreen(y) - rectY;
            
            // 绘制矩形
            ctx.fillStyle = y > 0 ? 'rgba(124, 58, 237, 0.3)' : 'rgba(239, 68, 68, 0.3)';
            ctx.fillRect(rectX, Math.min(rectY, rectY + rectHeight), rectWidth, Math.abs(rectHeight));
            
            // 矩形边框
            ctx.strokeStyle = y > 0 ? 'rgba(124, 58, 237, 0.6)' : 'rgba(239, 68, 68, 0.6)';
            ctx.lineWidth = 1;
            ctx.strokeRect(rectX, Math.min(rectY, rectY + rectHeight), rectWidth, Math.abs(rectHeight));
        }
        
        // 绘制积分区间的垂直线
        ctx.beginPath();
        ctx.moveTo(mapXToScreen(a), h * 0.1);
        ctx.lineTo(mapXToScreen(a), h * 0.9);
        ctx.moveTo(mapXToScreen(b), h * 0.1);
        ctx.lineTo(mapXToScreen(b), h * 0.9);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 绘制区间端点
        // a点
        ctx.beginPath();
        ctx.arc(mapXToScreen(a), h * 0.5, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // b点
        ctx.beginPath();
        ctx.arc(mapXToScreen(b), h * 0.5, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 显示积分区间
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`积分区间: [${a.toFixed(0)}, ${b.toFixed(0)}]`, w * 0.6, h * 0.85);
        
        // 显示面积
        const areaDisplay = totalArea.toFixed(1);
        document.getElementById('areaValue').textContent = areaDisplay;
        
        // 显示积分符号
        ctx.font = '16px STIX Two Math, serif';
        ctx.textAlign = 'center';
        ctx.fillText(`∫f(x)dx ≈ ${areaDisplay}`, w * 0.8, h * 0.15);
    }
}

// 微积分基本定理部分的Canvas
function initFundamentalTheoremCanvas() {
    const canvas = document.getElementById('fundamentalTheoremCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawFundamentalTheorem();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 函数f(x)
    function f(x) {
        return Math.sin(x / 40) * 40;
    }
    
    // 计算积分F(x) = ∫₀ˣ f(t)dt
    function F(x) {
        let sum = 0;
        const steps = 100;
        const dx = x / steps;
        
        for (let i = 0; i < steps; i++) {
            const t = i * dx;
            sum += f(t) * dx;
        }
        
        return sum;
    }
    
    function drawFundamentalTheorem() {
        const w = canvas.width;
        const h = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        
        // 绘制网格
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // 水平线
        for (let i = 0; i < 5; i++) {
            const y = h * 0.1 + i * h * 0.2;
            ctx.beginPath();
            ctx.moveTo(w * 0.1, y);
            ctx.lineTo(w * 0.9, y);
            ctx.stroke();
        }
        
        // 垂直线
        for (let i = 0; i < 5; i++) {
            const x = w * 0.1 + i * w * 0.2;
            ctx.beginPath();
            ctx.moveTo(x, h * 0.1);
            ctx.lineTo(x, h * 0.9);
            ctx.stroke();
        }
        
        // 绘制坐标轴
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.5);
        ctx.lineTo(w * 0.9, h * 0.5);
        ctx.moveTo(w * 0.5, h * 0.1);
        ctx.lineTo(w * 0.5, h * 0.9);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 坐标转换函数
        function mapXToDomain(screenX) {
            return (screenX / w) * 200 - 100; // 将屏幕X映射到[-100, 100]
        }
        
        function mapXToScreen(domainX) {
            return ((domainX + 100) / 200) * w;
        }
        
        function mapYToScreen1(domainY) {
            // 用于f(x)和F'(x)的Y映射
            return h * 0.5 - (domainY / 60) * h * 0.3;
        }
        
        function mapYToScreen2(domainY) {
            // 用于F(x)的Y映射（缩放因子不同）
            return h * 0.5 - (domainY / 200) * h * 0.3;
        }
        
        // 绘制f(x) - 蓝色
        ctx.beginPath();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        for (let x = -100; x <= 100; x++) {
            const y = f(x);
            const screenX = mapXToScreen(x);
            const screenY = mapYToScreen1(y);
            
            if (x === -100) {
                ctx.moveTo(screenX, screenY);
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();
        
        // 绘制F(x) - 红色（积分）
        ctx.beginPath();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        
        for (let x = -100; x <= 100; x++) {
            const y = F(x);
            const screenX = mapXToScreen(x);
            const screenY = mapYToScreen2(y);
            
            if (x === -100) {
                ctx.moveTo(screenX, screenY);
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();
        
        // 绘制F'(x) - 绿色（积分的导数）
        ctx.beginPath();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        
        for (let x = -100; x <= 100; x++) {
            // 数值微分近似F'(x)
            const hStep = 1;
            const derivative = (F(x + hStep) - F(x - hStep)) / (2 * hStep);
            const screenX = mapXToScreen(x);
            const screenY = mapYToScreen1(derivative);
            
            if (x === -100) {
                ctx.moveTo(screenX, screenY);
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 填充f(x)下的区域作为积分的表示
        ctx.beginPath();
        for (let x = -80; x <= 80; x++) {
            const y = f(x);
            const screenX = mapXToScreen(x);
            const screenY = mapYToScreen1(y);
            
            if (x === -80) {
                ctx.moveTo(screenX, mapYToScreen1(0));
                ctx.lineTo(screenX, screenY);
            } else {
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.lineTo(mapXToScreen(80), mapYToScreen1(0));
        ctx.closePath();
        ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
        ctx.fill();
        
        // 说明文字
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Inter, sans-serif';
        
        // f(x)标签
        ctx.fillStyle = '#2563eb';
        ctx.fillText('f(x)', mapXToScreen(70), mapYToScreen1(f(70)) - 10);
        
        // F(x)标签
        ctx.fillStyle = '#ef4444';
        ctx.fillText('F(x) = ∫f(t)dt', mapXToScreen(70), mapYToScreen2(F(70)) - 10);
        
        // F'(x)标签
        ctx.fillStyle = '#22c55e';
        ctx.fillText('F\'(x)', mapXToScreen(70), mapYToScreen1((F(70 + 1) - F(70 - 1)) / 2) + 20);
        
        // 基本定理表达式
        ctx.font = '16px STIX Two Math, serif';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText('d/dx [∫ₐˣ f(t)dt] = f(x)', w * 0.5, h * 0.15);
    }
}

// 物理应用Canvas
function initPhysicsCanvas() {
    const canvas = document.getElementById('physicsCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawPhysics();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function drawPhysics() {
        const w = canvas.width;
        const h = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        
        // 绘制背景网格
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const x = w * 0.1 + i * w * 0.2;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        
        for (let i = 0; i < 5; i++) {
            const y = h * 0.1 + i * h * 0.2;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // 绘制地面
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, h * 0.8, w, h * 0.2);
        
        // 绘制抛物线轨迹
        ctx.beginPath();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        for (let x = 0; x <= w; x += 5) {
            // 抛物线方程 y = ax² + bx + c
            const t = x / w;
            const y = h * 0.8 - 300 * t * (1 - t);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 绘制小球
        const ballX = w * 0.6;
        const ballY = h * 0.8 - 300 * 0.6 * (1 - 0.6);
        
        ctx.beginPath();
        ctx.arc(ballX, ballY, h * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = '#2563eb';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制速度向量
        const vx = 30;
        const vy = -300 * (1 - 2 * 0.6); // 导数
        
        ctx.beginPath();
        ctx.moveTo(ballX, ballY);
        ctx.lineTo(ballX + vx, ballY + vy);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制向量箭头
        const arrowAngle = Math.atan2(vy, vx);
        ctx.beginPath();
        ctx.moveTo(ballX + vx, ballY + vy);
        ctx.lineTo(
            ballX + vx - 8 * Math.cos(arrowAngle - Math.PI / 6),
            ballY + vy - 8 * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.lineTo(
            ballX + vx - 8 * Math.cos(arrowAngle + Math.PI / 6),
            ballY + vy - 8 * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = '#f97316';
        ctx.fill();
        
        // 文字说明
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('抛射体运动', w * 0.5, h * 0.1);
        ctx.fillText('速度向量', ballX + vx + 20, ballY + vy);
    }
}

// 经济学应用Canvas
function initEconomicsCanvas() {
    const canvas = document.getElementById('economicsCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawEconomics();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function drawEconomics() {
        const w = canvas.width;
        const h = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        
        // 绘制背景网格
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const x = w * 0.1 + i * w * 0.2;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        
        for (let i = 0; i < 5; i++) {
            const y = h * 0.1 + i * h * 0.2;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // 绘制坐标轴
        ctx.beginPath();
        ctx.moveTo(w * 0.15, h * 0.8);
        ctx.lineTo(w * 0.85, h * 0.8);
        ctx.moveTo(w * 0.15, h * 0.8);
        ctx.lineTo(w * 0.15, h * 0.2);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 绘制需求曲线
        ctx.beginPath();
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2;
        
        for (let x = w * 0.15; x <= w * 0.85; x += 5) {
            const t = (x - w * 0.15) / (w * 0.7);
            const y = h * 0.8 - t * h * 0.5;
            
            if (x === w * 0.15) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 绘制供给曲线
        ctx.beginPath();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        
        for (let x = w * 0.15; x <= w * 0.85; x += 5) {
            const t = (x - w * 0.15) / (w * 0.7);
            const y = h * 0.3 + t * h * 0.4;
            
            if (x === w * 0.15) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 平衡点
        const eqX = w * 0.5;
        const eqY = h * 0.55;
        
        ctx.beginPath();
        ctx.arc(eqX, eqY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.fill();
        
        // 消费者剩余（积分区域）
        ctx.beginPath();
        ctx.moveTo(w * 0.15, h * 0.3);
        for (let x = w * 0.15; x <= eqX; x += 5) {
            const t = (x - w * 0.15) / (w * 0.7);
            const y = h * 0.8 - t * h * 0.5;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(eqX, eqY);
        ctx.lineTo(w * 0.15, eqY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(124, 58, 237, 0.2)';
        ctx.fill();
        
        // 文字说明
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('供需平衡与消费者剩余', w * 0.5, h * 0.1);
        
        ctx.textAlign = 'right';
        ctx.fillText('需求', w * 0.85, h * 0.3);
        
        ctx.textAlign = 'left';
        ctx.fillText('供给', w * 0.85, h * 0.7);
        
        ctx.fillStyle = '#7c3aed';
        ctx.textAlign = 'center';
        ctx.fillText('消费者剩余', w * 0.3, h * 0.4);
    }
}

// 工程学应用Canvas
function initEngineeringCanvas() {
    const canvas = document.getElementById('engineeringCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawEngineering();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function drawEngineering() {
        const w = canvas.width;
        const h = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        
        // 绘制背景网格
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const x = w * 0.1 + i * w * 0.2;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        
        for (let i = 0; i < 5; i++) {
            const y = h * 0.1 + i * h * 0.2;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // 绘制梁
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(w * 0.1, h * 0.6, w * 0.8, h * 0.05);
        
        // 绘制支撑点
        ctx.fillStyle = '#64748b';
        ctx.fillRect(w * 0.1, h * 0.65, w * 0.05, h * 0.1);
        ctx.fillRect(w * 0.85, h * 0.65, w * 0.05, h * 0.1);
        
        // 绘制重物
        const weightX = w * 0.5;
        ctx.fillStyle = '#f97316';
        ctx.fillRect(weightX - w * 0.05, h * 0.5, w * 0.1, h * 0.1);
        
        // 绘制力箭头
        ctx.beginPath();
        ctx.moveTo(weightX, h * 0.5);
        ctx.lineTo(weightX, h * 0.3);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 箭头
        ctx.beginPath();
        ctx.moveTo(weightX, h * 0.3);
        ctx.lineTo(weightX - 5, h * 0.35);
        ctx.lineTo(weightX + 5, h * 0.35);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        
        // 绘制挠度曲线（梁的弯曲）
        ctx.beginPath();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        for (let x = w * 0.1; x <= w * 0.9; x += 5) {
            const t = (x - w * 0.1) / (w * 0.8);
            // 简单的挠度曲线
            const deflection = Math.sin(t * Math.PI) * 20;
            const y = h * 0.625 - deflection;
            
            if (x === w * 0.1) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 绘制应力分布曲线
        ctx.beginPath();
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2;
        
        for (let x = w * 0.1; x <= w * 0.9; x += 5) {
            const t = (x - w * 0.1) / (w * 0.8);
            // 应力与曲率相关，曲率是挠度的二阶导数
            const stress = Math.sin(t * Math.PI) * 30;
            const y = h * 0.2 + stress;
            
            if (x === w * 0.1) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // 文字说明
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('梁的弯曲与应力分析', w * 0.5, h * 0.1);
        ctx.fillText('F', weightX + 15, h * 0.3);
    }
}

// 电视可视化Canvas
function initTelevisionCanvas() {
    const canvas = document.getElementById('televisionCanvas');
    const ctx = canvas.getContext('2d');
    
    // 电视状态
    let channel = 1;
    let volume = 50;
    let isOn = true;
    let animationFrame;
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        if (isOn) {
            drawTelevision();
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 电视屏幕上的动态内容
    function drawTVContent(timestamp) {
        if (!isOn) return;
        
        const w = canvas.width;
        const h = canvas.height;
        const screenX = w * 0.2;
        const screenY = h * 0.2;
        const screenWidth = w * 0.6;
        const screenHeight = h * 0.5;
        
        // 清空屏幕区域
        ctx.fillStyle = '#000';
        ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
        
        // 根据不同频道显示不同内容
        if (channel === 1) {
            // 频道1：显示微积分图形
            drawCalculusContent(screenX, screenY, screenWidth, screenHeight, timestamp);
        } else if (channel === 2) {
            // 频道2：显示波浪动画
            drawWaveContent(screenX, screenY, screenWidth, screenHeight, timestamp);
        } else if (channel === 3) {
            // 频道3：显示彩色条纹
            drawStripeContent(screenX, screenY, screenWidth, screenHeight, timestamp);
        }
        
        // 显示频道和音量信息
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`频道: ${channel}`, screenX + 10, screenY + 20);
        ctx.fillText(`音量: ${volume}`, screenX + 10, screenY + 40);
        
        // 继续动画
        animationFrame = requestAnimationFrame(drawTVContent);
    }
    
    // 微积分图形内容
    function drawCalculusContent(x, y, width, height, timestamp) {
        const time = timestamp / 2000;
        
        // 绘制坐标轴
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y + height/2);
        ctx.lineTo(x + width, y + height/2);
        ctx.moveTo(x + width/2, y);
        ctx.lineTo(x + width/2, y + height);
        ctx.stroke();
        
        // 绘制正弦曲线
        ctx.beginPath();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        for (let i = 0; i <= width; i += 2) {
            const t = (i / width) * 2 * Math.PI;
            const sineY = Math.sin(t + time) * (height * 0.3) + height/2;
            
            if (i === 0) {
                ctx.moveTo(x + i, y + sineY);
            } else {
                ctx.lineTo(x + i, y + sineY);
            }
        }
        ctx.stroke();
        
        // 绘制导数曲线
        ctx.beginPath();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        
        for (let i = 0; i <= width; i += 2) {
            const t = (i / width) * 2 * Math.PI;
            const derivativeY = Math.cos(t + time) * (height * 0.3) + height/2;
            
            if (i === 0) {
                ctx.moveTo(x + i, y + derivativeY);
            } else {
                ctx.lineTo(x + i, y + derivativeY);
            }
        }
        ctx.stroke();
        
        // 添加说明文字
        ctx.fillStyle = 'white';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('f(x) = sin(x)', x + width * 0.75, y + height * 0.2);
        ctx.fillText("f'(x) = cos(x)", x + width * 0.75, y + height * 0.8);
    }
    
    // 波浪动画内容
    function drawWaveContent(x, y, width, height, timestamp) {
        const time = timestamp / 1000;
        
        for (let w = 0; w < 3; w++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${100 + w * 50}, ${150 + w * 30}, ${255}, 0.7)`;
            ctx.lineWidth = 2;
            
            for (let i = 0; i <= width; i += 2) {
                const t = (i / width) * 2 * Math.PI + time * (w + 1) * 0.5;
                const waveY = Math.sin(t) * (height * 0.1) * (3 - w) + height/2;
                
                if (i === 0) {
                    ctx.moveTo(x + i, y + waveY);
                } else {
                    ctx.lineTo(x + i, y + waveY);
                }
            }
            ctx.stroke();
        }
        
        // 添加随机噪点
        ctx.fillStyle = 'white';
        for (let i = 0; i < width * height * 0.0005; i++) {
            const nx = x + Math.random() * width;
            const ny = y + Math.random() * height;
            ctx.fillRect(nx, ny, 1, 1);
        }
    }
    
    // 彩色条纹内容
    function drawStripeContent(x, y, width, height, timestamp) {
        const time = timestamp / 500;
        const stripeCount = 10;
        
        for (let i = 0; i < stripeCount; i++) {
            const stripeWidth = width / stripeCount;
            const hue = (i * 36 + time * 20) % 360;
            
            ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
            ctx.fillRect(x + i * stripeWidth, y, stripeWidth, height);
        }
        
        // 添加扫描线
        const scanLineY = (Math.sin(time) * 0.5 + 0.5) * height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x, y + scanLineY, width, 2);
    }
    
    // 绘制电视外观
    function drawTelevision() {
        const w = canvas.width;
        const h = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        
        // 绘制电视主体
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);
        
        // 绘制电视边框
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(w * 0.2, h * 0.2, w * 0.6, h * 0.5);
        
        // 绘制底座
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(w * 0.35, h * 0.85, w * 0.3, h * 0.05);
        
        // 绘制按钮
        ctx.fillStyle = '#718096';
        ctx.beginPath();
        ctx.arc(w * 0.3, h * 0.8, w * 0.02, 0, Math.PI * 2);
        ctx.arc(w * 0.4, h * 0.8, w * 0.02, 0, Math.PI * 2);
        ctx.arc(w * 0.6, h * 0.8, w * 0.02, 0, Math.PI * 2);
        ctx.arc(w * 0.7, h * 0.8, w * 0.02, 0, Math.PI * 2);
        ctx.fill();
        
        // 如果电视打开，绘制屏幕内容
        if (isOn) {
            drawTVContent(Date.now());
        } else {
            // 电视关闭时显示黑屏
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(w * 0.2, h * 0.2, w * 0.6, h * 0.5);
            
            // 绘制电源指示灯（红色）
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(w * 0.5, h * 0.18, w * 0.01, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 绘制文字说明
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('交互式电视可视化', w * 0.5, h * 0.95);
        
        // 绘制操作提示
        if (isOn) {
            ctx.fillStyle = '#4a5568';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('点击屏幕切换频道 | 滚轮调整音量 | 双击开关电视', w * 0.5, h * 0.05);
        }
    }
    
    // 切换电视开关
    function togglePower() {
        isOn = !isOn;
        
        if (isOn) {
            drawTelevision();
        } else {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            drawTelevision();
        }
    }
    
    // 切换频道
    function changeChannel() {
        if (!isOn) return;
        channel = (channel % 3) + 1;
    }
    
    // 调整音量
    function adjustVolume(delta) {
        if (!isOn) return;
        volume = Math.max(0, Math.min(100, volume + delta));
    }
    
    // 添加鼠标事件
    canvas.addEventListener('click', () => {
        if (isOn) {
            changeChannel();
        }
    });
    
    canvas.addEventListener('dblclick', () => {
        togglePower();
    });
    
    // 滚轮事件
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            adjustVolume(-5);
        } else {
            adjustVolume(5);
        }
    });
    
    // 触摸事件（移动端）
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (isOn) {
            changeChannel();
        }
    }, { passive: false });
    
    // 初始化绘制
    drawTelevision();
}