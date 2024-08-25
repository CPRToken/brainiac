// src/utils/print-content.js
export const printContent = (title: string) => {
  const originalTitle = document.title;
  document.title = title.replace(/_/g, ' '); // Format the title as needed for the print filename

  window.print();

  document.title = originalTitle; // Reset the title after printing
};
