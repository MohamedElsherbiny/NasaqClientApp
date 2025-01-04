export const DEFAULT_CONTRACT_TEMPLATE = `
    <!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>عقد اتفاق</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            direction: rtl;
            text-align: right;
        }

        .contract-container {
            max-width: 800px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
            text-align: center;
        }

        p {
            margin-bottom: 20px;
        }

        .dynamic-field {
            font-weight: bold;
            color: #007bff;
        }

        .signature {
            margin-top: 30px;
        }

        .signature-line {
            border-top: 1px solid #333;
            width: 300px;
            margin: 20px 0;
        }

        .price-section {
            margin-top: 30px;
            background-color: #f1f1f1;
            padding: 15px;
            border-radius: 8px;
        }

        .price-section h2 {
            text-align: center;
            color: #555;
        }

        .price-details {
            margin-top: 10px;
        }

        .price-details p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="contract-container">
        <h1>عقد اتفاق</h1>
        <p>
            بتاريخ <span class="dynamic-field">[Date]</span>، تم الاتفاق بين:
        </p>
        <p>
            <strong>الناشر:</strong> <span class="dynamic-field">[Publisher]</span>
            <br>
            <strong>المؤلف:</strong> <span class="dynamic-field">[Author]</span>
        </p>
        <p>
            بموجب هذا العقد، يتفق الطرفان على التعاون وفقًا للشروط والأحكام التي تم مناقشتها والموافقة عليها.
        </p>

        <div class="price-section">
            <h2>تفاصيل السعر</h2>
            <div class="price-details">
                <p>
                    <strong>المبلغ الإجمالي:</strong> <span class="dynamic-field">[TotalPrice]</span> 
                </p>
            </div>
        </div>

        <div class="signature">
            <p><strong>توقيع الناشر:</strong></p>
            <div class="signature-line"></div>
            <p><strong>توقيع المؤلف:</strong></p>
            <div class="signature-line"></div>
        </div>
    </div>
</body>
</html>
    `;
