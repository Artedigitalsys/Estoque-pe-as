import { Part } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (parts: Part[], filename: string) => {
  const data = parts.map(part => ({
    'Código': part.code,
    'Nome': part.name,
    'Categoria': part.category,
    'Estoque Atual': part.currentStock,
    'Estoque Mínimo': part.minimumStock,
    'Unidade': part.unit,
    'Status': part.currentStock < part.minimumStock ? 'Abaixo do mínimo' : 'Normal'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Peças');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (parts: Part[], title: string, filename: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 105, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Create table data
  const tableData = parts.map(part => [
    part.code,
    part.name,
    part.category,
    part.currentStock.toString(),
    part.minimumStock.toString(),
    part.unit,
    part.currentStock < part.minimumStock ? 'Abaixo do mínimo' : 'Normal'
  ]);
  
  // Add table
  (doc as any).autoTable({
    startY: 40,
    head: [['Código', 'Nome', 'Categoria', 'Estoque Atual', 'Estoque Mínimo', 'Unidade', 'Status']],
    body: tableData,
  });
  
  doc.save(`${filename}.pdf`);
};