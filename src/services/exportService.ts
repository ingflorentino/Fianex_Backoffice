import { AppUser, VerificationRequest, Transaction } from '../types';

export const exportToExcelCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  // UTF-8 BOM for Excel Spanish characters compatibility
  const BOM = '\uFEFF';
  const csvContent =
    BOM +
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(';') +
    '\n' +
    rows
      .map((row) =>
        row
          .map((cell) => {
            const str = String(cell ?? '');
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(';')
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportUsersToExcel = (users: AppUser[]) => {
  const headers = [
    'ID Usuario',
    'Nombre Completo',
    'Correo Electrónico',
    'Teléfono',
    'Tipo de Usuario',
    'Ciudad',
    'Estado Cuenta',
    'Categoría Experto',
    'Profesión u Oficio',
    'Plan de Suscripción',
    'Estado Verificación',
    'Calificación (Estrellas)',
    'Trabajos Completados',
    'Propuestas Mensuales Usadas',
    'Límite Propuestas',
    'Fecha de Registro'
  ];

  const rows = users.map((u) => [
    u.id,
    u.name,
    u.email,
    u.phone,
    u.type === 'expert' ? 'Experto / Proveedor' : 'Cliente Solicitante',
    u.city,
    u.status.toUpperCase(),
    u.expertCategory || 'N/A',
    u.expertProfession || 'N/A',
    u.expertPlan ? u.expertPlan.toUpperCase() : 'N/A',
    u.verificationStatus,
    u.rating ?? 'N/A',
    u.completedJobs ?? 0,
    u.monthlyProposalsUsed ?? 0,
    u.monthlyProposalsLimit === 'unlimited' ? 'Ilimitadas' : (u.monthlyProposalsLimit ?? 'N/A'),
    u.registeredAt
  ]);

  exportToExcelCSV('Fianex_Reporte_Usuarios', headers, rows);
};

export const exportVerificationsToExcel = (verifications: VerificationRequest[]) => {
  const headers = [
    'ID Solicitud',
    'ID Experto',
    'Nombre Experto',
    'Correo',
    'Tipo Validación',
    'Tipo Documento',
    'No. Documento / Cédula',
    'Categoría Solicitada',
    'Profesión',
    'Estado Solicitud',
    'Fecha Envío',
    'Fecha Revisión',
    'Revisado Por',
    'Observaciones / Motivo Rechazo',
    'Emisor Documento'
  ];

  const rows = verifications.map((v) => [
    v.id,
    v.userId,
    v.userName,
    v.userEmail,
    v.type === 'identity' ? 'Verificación de Identidad' : 'Categoría Profesional',
    v.docType,
    v.idNumber || 'N/A',
    v.category || 'N/A',
    v.profession || 'N/A',
    v.status.toUpperCase(),
    v.submittedAt,
    v.reviewedAt || 'Pendiente',
    v.reviewedBy || 'Sin asignar',
    v.status === 'rejected' ? (v.rejectionReason || 'Rechazado') : (v.reviewerNotes || 'Aprobado'),
    v.documentMeta.issuer || 'N/A'
  ]);

  exportToExcelCSV('Fianex_Reporte_Verificaciones_KYC', headers, rows);
};

export const exportTransactionsToExcel = (transactions: Transaction[]) => {
  const headers = [
    'ID Transacción',
    'Referencia',
    'Usuario',
    'Tipo Usuario',
    'Concepto',
    'Plan de Suscripción',
    'Monto',
    'Moneda',
    'Estado',
    'Método de Pago',
    'Fecha y Hora',
    'Descripción Detallada'
  ];

  const rows = transactions.map((t) => [
    t.id,
    t.reference,
    t.userName,
    t.userType === 'expert' ? 'Experto' : 'Cliente',
    t.type,
    t.plan ? t.plan.toUpperCase() : 'N/A',
    t.amount.toFixed(2),
    t.currency,
    t.status.toUpperCase(),
    t.paymentMethod,
    t.date,
    t.description
  ]);

  exportToExcelCSV('Fianex_Reporte_Financiero_Transacciones', headers, rows);
};

export const printOfficialPDFReport = (reportConfig: {
  title: string;
  subtitle: string;
  kpis: { label: string; value: string }[];
  tables: { title: string; headers: string[]; rows: string[][] }[];
}) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permita ventanas emergentes para generar el reporte PDF.');
    return;
  }

  const currentDate = new Date().toLocaleString('es-DO', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>${reportConfig.title} - Fianex Backoffice</title>
      <style>
        @page { size: A4 portrait; margin: 18mm; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 0;
          font-size: 11pt;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0f766e;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .brand-title {
          font-size: 22pt;
          font-weight: 800;
          color: #0f766e;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .brand-subtitle {
          font-size: 9pt;
          color: #64748b;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .meta-box {
          text-align: right;
          font-size: 8.5pt;
          color: #475569;
        }
        .report-heading {
          margin-bottom: 18px;
        }
        .report-title {
          font-size: 15pt;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .report-desc {
          font-size: 9.5pt;
          color: #64748b;
          margin: 0;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(${reportConfig.kpis.length}, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .kpi-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 14px;
        }
        .kpi-label {
          font-size: 8pt;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .kpi-value {
          font-size: 16pt;
          font-weight: 700;
          color: #0f172a;
          font-variant-numeric: tabular-nums;
        }
        .section-title {
          font-size: 12pt;
          font-weight: 700;
          color: #0f172a;
          margin: 20px 0 10px 0;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 9pt;
        }
        th {
          background-color: #f1f5f9;
          color: #334155;
          text-align: left;
          padding: 8px 10px;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }
        td {
          padding: 7px 10px;
          border: 1px solid #e2e8f0;
          color: #334155;
        }
        tr:nth-child(even) {
          background-color: #fafafa;
        }
        .footer {
          margin-top: 30px;
          border-top: 1px solid #e2e8f0;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          font-size: 8pt;
          color: #94a3b8;
        }
        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 7.5pt;
          font-weight: 600;
        }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-info { background: #e0f2fe; color: #075985; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="brand-title">FIANEX</h1>
          <div class="brand-subtitle">Plataforma Operativa & Sistema de Verificación</div>
        </div>
        <div class="meta-box">
          <div><strong>Fecha de emisión:</strong> ${currentDate}</div>
          <div><strong>Entorno:</strong> Producción (Supabase Cloud + Cloudflare)</div>
          <div><strong>Auditoría ID:</strong> FNX-${Date.now().toString().slice(-6)}</div>
        </div>
      </div>

      <div class="report-heading">
        <h2 class="report-title">${reportConfig.title}</h2>
        <p class="report-desc">${reportConfig.subtitle}</p>
      </div>

      <div class="kpi-grid">
        ${reportConfig.kpis
          .map(
            (k) => `
          <div class="kpi-card">
            <div class="kpi-label">${k.label}</div>
            <div class="kpi-value">${k.value}</div>
          </div>
        `
          )
          .join('')}
      </div>

      ${reportConfig.tables
        .map(
          (table) => `
        <div class="section-title">${table.title}</div>
        <table>
          <thead>
            <tr>
              ${table.headers.map((h) => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${table.rows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell}</td>`).join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
        )
        .join('')}

      <div class="footer">
        <div>Fianex Mobile App Backoffice · Confidencial y Privado</div>
        <div>Página 1 de 1 · Generado por el Sistema de Operaciones Fianex</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
