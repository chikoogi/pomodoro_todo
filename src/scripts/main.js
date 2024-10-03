import { loadComponent } from './components.js';
import "../styles/layout.css";

document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');

    // 각 컴포넌트를 동적으로 로드
    await loadComponent('/src/layout/header.html', 'header');
    await loadComponent('/src/layout/left-panel.html', 'left-panel');
    await loadComponent('/src/layout/right-panel.html', 'right-panel');
});