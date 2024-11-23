// jest.setup.js
require('@testing-library/jest-dom');

const { jestPreviewConfigure } = require('jest-preview');

// ตั้งค่า Jest Preview ให้ใช้ CSS และ Asset ที่ต้องการ
jestPreviewConfigure({
  css: ['./path/to/styles.css'], // ใส่เส้นทาง CSS ของคุณ
});