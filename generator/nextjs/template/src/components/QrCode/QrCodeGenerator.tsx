// components/QrCodeGenerator.tsx
import React from 'react';
import QRCode from 'qrcode.react';

const QrCodeGenerator = ({ qrCodeData }: { qrCodeData: string }) => {
  return (
    <QRCode value={qrCodeData} size={256} />
  );
}

export default QrCodeGenerator;