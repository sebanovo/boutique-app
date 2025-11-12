import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";

export function ExportarEstadoResultados({ data }) {
  if (!data) return null;

  const exportPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text("Estado de Resultados", 14, 20);

    // Resumen Principal
    const resumen = [
      ["Ingresos por Ventas", data.resumen.ingresos_ventas],
      ["Costos Directos", data.resumen.costo_productos_vendidos + data.resumen.costos_envio],
      ["Ganancia Bruta", data.resumen.ganancia_bruta],
      ["Gastos Operativos", data.resumen.total_gastos_operativos],
      ["Utilidad Operativa", data.resumen.utilidad_operativa],
      ["Utilidad Neta", data.resumen.utilidad_neta],
    ];
    doc.autoTable({
      startY: 30,
      head: [["Concepto", "Monto"]],
      body: resumen.map(([k, v]) => [k, `Bs. ${v.toLocaleString("es-BO")}`])
    });

    doc.save("EstadoResultados.pdf");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Resumen
    const resumenData = [
      ["Concepto", "Monto"],
      ["Ingresos por Ventas", data.resumen.ingresos_ventas],
      ["Costos Directos", data.resumen.costo_productos_vendidos + data.resumen.costos_envio],
      ["Ganancia Bruta", data.resumen.ganancia_bruta],
      ["Gastos Operativos", data.resumen.total_gastos_operativos],
      ["Utilidad Operativa", data.resumen.utilidad_operativa],
      ["Utilidad Neta", data.resumen.utilidad_neta],
    ];

    const ws = XLSX.utils.aoa_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(wb, ws, "Resumen");
    XLSX.writeFile(wb, "EstadoResultados.xlsx");
  };

  const exportWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Estado de Resultados", heading: "Heading1" }),
            ...Object.entries(data.resumen).map(([key, value]) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${key.replace(/_/g, " ")}: `, bold: true }),
                  new TextRun(`Bs. ${value.toLocaleString("es-BO")}`)
                ]
              })
            )
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "EstadoResultados.docx");
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <button onClick={exportPDF} style={{ marginRight: 10 }}>Exportar PDF</button>
      <button onClick={exportExcel} style={{ marginRight: 10 }}>Exportar Excel</button>
      <button onClick={exportWord}>Exportar Word</button>
    </div>
  );
}
