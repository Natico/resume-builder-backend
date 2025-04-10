const puppeteer = require('puppeteer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const express = require('express');
const handlebars = require('handlebars');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;


// افزایش محدودیت اندازه بدنه درخواست
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());
app.use(express.json()); // برای پارس کردن JSON داخل body

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

app.post('/generate', async (req, res) => {
  const resumeData = req.body;
  console.log('📥 Backend received data:', JSON.stringify(resumeData, null, 2));

  const templateName = resumeData.templateName || 'template_default';
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);

  const htmlSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(htmlSource);
  const htmlContent = template(resumeData);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  
  const renderedHTML = await page.content();
  fs.writeFileSync('debug-output.html', renderedHTML);
  
  await page.emulateMediaType('screen');
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });
  await browser.close();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=resume.pdf',
  });

  res.send(pdfBuffer);
});

app.get('/template', (req, res) => {
  const templateName = req.query.name;
  if (!templateName) {
    return res.status(400).json({ error: 'Template name is required' });
  }

  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);

  if (!fs.existsSync(templatePath)) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const htmlContent = fs.readFileSync(templatePath, 'utf8');
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlContent);
});

app.get('/templates', (req, res) => {
  const templatesDir = path.join(__dirname, 'templates');

  fs.readdir(templatesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read templates directory' });
    }

    const templateNames = files
      .filter(f => f.endsWith('.html'))
      .map(f => path.basename(f, '.html'));

    res.json(templateNames);
  });
});