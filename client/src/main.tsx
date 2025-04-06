import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 添加样式加载检查
const checkStylesLoaded = () => {
  const styles = document.styleSheets;
  console.log('已加载样式表数量:', styles.length);
  Array.from(styles).forEach((sheet, index) => {
    console.log(`样式表 ${index}:`, sheet.href || '内联样式');
  });
};

window.addEventListener('load', checkStylesLoaded);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
