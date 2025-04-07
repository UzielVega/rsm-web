import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Maintenance } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class TicketPdfService {
  constructor() {}

  async generateTicket(data: Maintenance): Promise<void> {
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 160], // Ancho de 80mm y altura dinámica
    });

    try {
      // Cargar la imagen y convertirla a Base64
      const logoBase64 = await this.loadImage('images/logo.png');

      // Agregar la imagen
      this.addImage(doc, logoBase64);

      // Agregar encabezado de la tienda
      this.addStoreHeader(doc);

      // Agregar información del cliente y la venta
      this.addClientInfo(doc, data);

      // Agregar método de pago y periodo
      let positionY = 80; // Posición inicial para el método de pago
      positionY = this.addPaymentMethod(doc, data, positionY);
      positionY = this.addPeriod(doc, data, positionY);

      // Agregar total y mensaje de agradecimiento
      this.addTotalAndThankYouMessage(doc, data, positionY);

      // Guardar el PDF
      doc.save(`PAGO_${new Date(data.startDate!)
        .toLocaleString('default', {
          month: 'long',
        })
        .toUpperCase()}_${new Date(data.endDate!)
        .toLocaleString('default', {
          month: 'long',
        })
        .toUpperCase()}_${data.house?.street?.name?.toUpperCase()}_${data.house?.number}.pdf`);
    } catch (error) {
      console.error('Error generating ticket:', error);
    }
  }

  private addImage(doc: jsPDF, logoBase64: string): void {
    doc.addImage(logoBase64, 'PNG', 10, 5, 60, 20); // x, y, width, height
  }

  private addStoreHeader(doc: jsPDF): void {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Rinconada San Miguel', 40, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Pago de Mantenimiento', 40, 35, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Dirección: Rcda. Bugambilia 10,', 40, 40, { align: 'center' });
    doc.text('La Piedad, 54725 Cuautitlán Izcalli, Méx.', 40, 44, {
      align: 'center',
    });

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.line(5, 47, 75, 47);
  }

  private addClientInfo(doc: jsPDF, data: Maintenance): void {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Cerrada:`, 5, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.house?.street?.name!.toUpperCase()}`, 21, 52);

    doc.setFont('helvetica', 'bold');
    doc.text(`Casa:`, 5, 58);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.house?.name?.toUpperCase()}`, 21, 58);

    doc.setFont('helvetica', 'bold');
    doc.text(`Fecha:`, 5, 64);
    doc.setFont('helvetica', 'normal');
    doc.text(`${new Date(data.paymentDate!).toLocaleDateString()}`, 21, 64);

    doc.setFont('helvetica', 'bold');
    doc.text(`Folio:`, 5, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.id}`, 21, 70);

    // Línea divisoria
    doc.line(5, 75, 75, 75);
  }

  private addPaymentMethod(
    doc: jsPDF,
    data: Maintenance,
    positionY: number
  ): number {
    doc.setFont('helvetica', 'bold');
    doc.text('Método de Pago:', 5, positionY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.paymentMethod?.name?.toUpperCase()}`, 40, positionY);
    return positionY + 10; // Ajustar la posición para el siguiente contenido
  }

  private addPeriod(doc: jsPDF, data: Maintenance, positionY: number): number {
    doc.setFont('helvetica', 'bold');
    doc.text('Periodo:', 5, positionY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.period?.toUpperCase()}`, 40, positionY);
    positionY += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Meses:', 5, positionY);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${new Date(data.startDate!)
        .toLocaleString('default', {
          month: 'long',
        })
        .toUpperCase()} - ${new Date(data.endDate!)
        .toLocaleString('default', {
          month: 'long',
        })
        .toUpperCase()}`,
      40,
      positionY
    );
    return positionY + 10;
  }

  private addTotalAndThankYouMessage(
    doc: jsPDF,
    data: Maintenance,
    positionY: number
  ): void {
    const total = data.amount!;

    // Línea divisoria antes del total
    doc.line(5, positionY + 5, 75, positionY + 5);

    // Total centrado
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${total.toFixed(2)}`, 40, positionY + 15, {
      align: 'center',
    });

    // Mensaje de agradecimiento
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Gracias por su pago', 40, positionY + 25, { align: 'center' });
  }

  // Método para cargar imagen como Base64
  private loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  }
}
