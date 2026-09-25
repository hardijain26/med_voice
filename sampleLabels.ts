/**
 * Sample prescription label generator to allow seniors and testers
 * to test Med-Voice immediately without uploading an actual photo.
 */

export interface SampleLabel {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  warning: string;
  doctor: string;
  rxNumber: string;
  dataUrl: string;
}

export function generateSampleCanvasLabel(
  medicineName: string,
  dosage: string,
  instructions: string,
  warning: string,
  rxNumber: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#fefcbf'; // Prescription yellow
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pharmacy Banner
  ctx.fillStyle = '#1e3a8a'; // Deep Rx blue
  ctx.fillRect(0, 0, canvas.width, 70);

  // Banner Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('HEALTH-CARE COMMUNITY PHARMACY', 30, 42);

  // RX & Date
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`RX #: ${rxNumber}`, 30, 105);
  ctx.fillText(`DATE: ${new Date().toLocaleDateString()}`, 380, 105);

  // Divider
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 120);
  ctx.lineTo(570, 120);
  ctx.stroke();

  // Patient Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('PATIENT: ELEANOR VANCE (AGE: 74)', 30, 150);

  // Medicine Name & Dosage
  ctx.fillStyle = '#b91c1c'; // Red highlight
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(`${medicineName} ${dosage}`, 30, 195);

  // Instructions
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`INSTRUCTIONS: ${instructions}`, 30, 235);

  // Caution Box
  ctx.fillStyle = '#fee2e2';
  ctx.fillRect(30, 260, 540, 50);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 260, 540, 50);

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`⚠️ CAUTION: ${warning}`, 45, 292);

  // Refills
  ctx.fillStyle = '#475569';
  ctx.font = '14px sans-serif';
  ctx.fillText('REFILLS: 2 BEFORE 12/2026 | DR. R. SMITH, MD', 30, 338);

  return canvas.toDataURL('image/jpeg', 0.9);
}

export function getSampleLabels(): SampleLabel[] {
  return [
    {
      id: 'amoxicillin',
      name: 'Amoxicillin',
      dosage: '500mg Capsule',
      instructions: 'Take 1 capsule by mouth 3 times daily with meals. Finish all.',
      warning: 'Take with food. Do not skip doses.',
      doctor: 'Dr. R. Smith',
      rxNumber: 'RX-982134',
      dataUrl: generateSampleCanvasLabel(
        'AMOXICILLIN',
        '500mg Capsule',
        'Take 1 capsule 3 times daily with meals.',
        'Finish full course even if feeling better.',
        'RX-982134'
      )
    },
    {
      id: 'metformin',
      name: 'Metformin',
      dosage: '850mg Tablet',
      instructions: 'Take 1 tablet twice daily with morning breakfast and evening dinner.',
      warning: 'Take with meals to reduce stomach upset.',
      doctor: 'Dr. A. Sharma',
      rxNumber: 'RX-441029',
      dataUrl: generateSampleCanvasLabel(
        'METFORMIN',
        '850mg Tablet',
        'Take 1 tablet twice daily with breakfast & dinner.',
        'Take with meals. Do not drink alcohol.',
        'RX-441029'
      )
    },
    {
      id: 'atorvastatin',
      name: 'Atorvastatin',
      dosage: '20mg Tablet',
      instructions: 'Take 1 tablet once daily at bedtime.',
      warning: 'Avoid drinking grapefruit juice while on this medication.',
      doctor: 'Dr. M. Patel',
      rxNumber: 'RX-771203',
      dataUrl: generateSampleCanvasLabel(
        'ATORVASTATIN',
        '20mg Tablet',
        'Take 1 tablet once daily at bedtime.',
        'Avoid grapefruit juice. Take at bedtime.',
        'RX-771203'
      )
    }
  ];
}
