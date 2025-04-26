import { Resume, ResumeTemplate } from "@shared/schema";
import puppeteer from "puppeteer";
import { generateJakeGutTemplate } from "./jakeGutTemplate";

// Function to generate a PDF from resume data and selected template
export async function generatePDF(resumeData: Resume, template: ResumeTemplate, settings: any = {}): Promise<Buffer> {
  let browser = null;
  try {
    // Generate the HTML for the resume
    const htmlContent = generateResumeHTML(resumeData, template, settings);

    // Launch Puppeteer with more flexible configuration
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-extensions'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport size to ensure content fits properly
    await page.setViewport({ width: 1100, height: 1400 });

    // Set content to the HTML with longer timeout
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Configure PDF options based on settings
    const pdfOptions: any = {
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: true
    };
    
    // Set paper size from settings
    if (settings.paperSize === 'letter' || !settings.paperSize) {
      pdfOptions.format = 'Letter';
    } else if (settings.paperSize === 'a4') {
      pdfOptions.format = 'A4';
    }
    
    // Generate the PDF
    const pdfData = await page.pdf(pdfOptions);
    
    // Convert Uint8Array to Buffer
    const pdfBuffer = Buffer.from(pdfData);
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate PDF: ${errorMessage}`);
  } finally {
    // Make sure browser closes even if there's an error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
}

function generateResumeHTML(resumeData: Resume, template: ResumeTemplate, settings: any = {}): string {
  // Function to get font family CSS
  const getFontFamily = (fontFamily: string): string => {
    switch (fontFamily) {
      case 'times':
        return "'Times New Roman', Times, serif";
      case 'calibri':
        return "Calibri, 'Segoe UI', sans-serif";
      case 'arial':
        return "Arial, Helvetica, sans-serif";
      case 'garamond':
        return "Garamond, Georgia, serif";
      case 'helvetica':
        return "Helvetica, Arial, sans-serif";
      default:
        return "'Times New Roman', Times, serif";
    }
  };

  // Default settings if not provided
  const fontSize = settings.fontSize || 11;
  const fontFamily = settings.fontFamily || 'times';
  const lineSpacing = settings.lineSpacing || 1.15;
  const paperSize = settings.paperSize || 'letter';
  
  // Common styles for all templates with settings applied
  const commonStyles = `
    body {
      font-family: ${getFontFamily(fontFamily)};
      font-size: ${fontSize}pt;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      color: #333;
      line-height: ${lineSpacing};
    }
    .resume-page {
      width: ${paperSize === 'letter' ? '8.5in' : '210mm'};
      height: ${paperSize === 'letter' ? '11in' : '297mm'};
      padding: 0.6in;
      box-sizing: border-box;
      background-color: white;
    }
    @page {
      size: ${paperSize} portrait;
      margin: 0;
    }
  `;

  // Get the template-specific HTML - Default to Jake Gut template for all options
  // Use jake gut template for better professional formatting
  const templateHTML = generateJakeGutTemplate(resumeData, settings);
  
  /* Original template selection (disabled for professional formatting)
  let templateHTML = '';
  switch (template) {
    case 'modern':
      templateHTML = generateModernTemplate(resumeData);
      break;
    case 'classic':
      templateHTML = generateClassicTemplate(resumeData);
      break;
    case 'minimal':
      templateHTML = generateMinimalTemplate(resumeData);
      break;
    case 'creative':
      templateHTML = generateCreativeTemplate(resumeData);
      break;
    default:
      templateHTML = generateModernTemplate(resumeData);
  }
  */

  // Complete HTML document
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume - ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</title>
      <style>
        ${commonStyles}
      </style>
    </head>
    <body>
      <div class="resume-page">
        ${templateHTML}
      </div>
    </body>
    </html>
  `;
}

function generateModernTemplate(resumeData: Resume): string {
  return `
    <style>
      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }
      .header-left h1 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
      }
      .header-left h2 {
        font-size: 1.25rem;
        color: #3B82F6;
        font-weight: 500;
        margin: 0.25rem 0 0 0;
      }
      .header-right {
        text-align: right;
        font-size: 0.875rem;
        color: #666;
      }
      .header-right div {
        margin-bottom: 0.25rem;
      }
      .section {
        margin-bottom: 1.5rem;
      }
      .section-heading {
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.25rem;
        margin-bottom: 0.5rem;
      }
      .experience-item, .education-item {
        margin-bottom: 1rem;
      }
      .experience-header, .education-header {
        display: flex;
        justify-content: space-between;
      }
      .job-title, .degree {
        font-size: 0.875rem;
        font-weight: bold;
      }
      .company, .institution {
        font-size: 0.875rem;
        color: #3B82F6;
        font-weight: 500;
      }
      .period {
        font-size: 0.75rem;
        color: #666;
      }
      .achievements {
        list-style-type: disc;
        padding-left: 1.25rem;
        margin-top: 0.5rem;
        font-size: 0.875rem;
      }
      .achievements li {
        margin-bottom: 0.25rem;
      }
      .two-columns {
        display: flex;
        gap: 1.5rem;
      }
      .column {
        flex: 1;
      }
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .skill {
        background-color: rgba(59, 130, 246, 0.1);
        color: #3B82F6;
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
      }
      .certifications-list {
        list-style-type: disc;
        padding-left: 1.25rem;
        margin-top: 0.5rem;
        font-size: 0.875rem;
      }
    </style>

    <div class="header">
      <div class="header-left">
        <h1>${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</h1>
        <h2>${resumeData.personalInfo.title}</h2>
      </div>
      <div class="header-right">
        ${resumeData.personalInfo.email ? `<div>${resumeData.personalInfo.email}</div>` : ''}
        ${resumeData.personalInfo.phone ? `<div>${resumeData.personalInfo.phone}</div>` : ''}
        ${resumeData.personalInfo.location ? `<div>${resumeData.personalInfo.location}</div>` : ''}
        ${resumeData.personalInfo.linkedin ? `<div>${resumeData.personalInfo.linkedin}</div>` : ''}
        ${resumeData.personalInfo.portfolio ? `<div>${resumeData.personalInfo.portfolio}</div>` : ''}
      </div>
    </div>

    ${resumeData.summary ? `
    <div class="section">
      <h3 class="section-heading">Professional Summary</h3>
      <p style="font-size: 0.875rem; margin-top: 0.5rem;">${resumeData.summary}</p>
    </div>
    ` : ''}

    ${resumeData.experience.length > 0 ? `
    <div class="section">
      <h3 class="section-heading">Work Experience</h3>
      ${resumeData.experience.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <div>
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company}</div>
            </div>
            <div class="period">${exp.period}</div>
          </div>
          ${exp.description ? `<p style="font-size: 0.875rem; margin-top: 0.5rem;">${exp.description}</p>` : ''}
          ${exp.achievements && exp.achievements.length > 0 ? `
            <ul class="achievements">
              ${exp.achievements.filter(achievement => achievement.trim()).map(achievement => `
                <li>${achievement}</li>
              `).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${resumeData.education.length > 0 ? `
    <div class="section">
      <h3 class="section-heading">Education</h3>
      ${resumeData.education.map(edu => `
        <div class="education-item">
          <div class="education-header">
            <div>
              <div class="degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
              <div class="institution">${edu.institution}</div>
            </div>
            <div class="period">${edu.period}</div>
          </div>
          ${(edu.gpa || edu.additionalInfo) ? `
            <div style="font-size: 0.75rem; margin-top: 0.25rem;">
              ${edu.gpa ? `GPA: ${edu.gpa}` : ''} 
              ${(edu.gpa && edu.additionalInfo) ? ', ' : ''}
              ${edu.additionalInfo || ''}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="two-columns">
      ${resumeData.skills.length > 0 ? `
      <div class="column">
        <h3 class="section-heading">Skills</h3>
        <div class="skills-list">
          ${resumeData.skills.filter(skill => skill.trim()).map(skill => `
            <span class="skill">${skill}</span>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${resumeData.certifications.length > 0 ? `
      <div class="column">
        <h3 class="section-heading">Certifications</h3>
        <ul class="certifications-list">
          ${resumeData.certifications.map(cert => `
            <li>${cert.name} ${cert.issuer ? `(${cert.issuer})` : ''} ${cert.date ? `- ${cert.date}` : ''}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
  `;
}

function generateClassicTemplate(resumeData: Resume): string {
  return `
    <style>
      .classic-header {
        text-align: center;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #ddd;
        padding-bottom: 1rem;
      }
      .classic-header h1 {
        font-size: 1.5rem;
        font-weight: bold;
        text-transform: uppercase;
        margin: 0;
      }
      .classic-header h2 {
        font-size: 1.25rem;
        color: #666;
        font-weight: 500;
        margin: 0.25rem 0 0.5rem 0;
      }
      .contact-info {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
        font-size: 0.875rem;
        color: #666;
      }
      .contact-info div {
        white-space: nowrap;
      }
      .section {
        margin-bottom: 1.5rem;
      }
      .section-heading {
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
      }
      .experience-item, .education-item {
        margin-bottom: 1rem;
      }
      .experience-header, .education-header {
        display: flex;
        justify-content: space-between;
      }
      .job-title, .degree {
        font-size: 0.875rem;
        font-weight: bold;
      }
      .company, .institution {
        font-size: 0.875rem;
        font-style: italic;
        color: #666;
      }
      .period {
        font-size: 0.75rem;
        color: #666;
      }
      .achievements {
        list-style-type: disc;
        padding-left: 1.25rem;
        margin-top: 0.5rem;
        font-size: 0.875rem;
      }
      .achievements li {
        margin-bottom: 0.25rem;
      }
      .skills-list {
        font-size: 0.875rem;
        margin: 0.5rem 0;
      }
      .skill-dot {
        display: inline-block;
        margin: 0 0.25rem;
      }
    </style>

    <div class="classic-header">
      <h1>${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</h1>
      <h2>${resumeData.personalInfo.title}</h2>
      <div class="contact-info">
        ${resumeData.personalInfo.email ? `<div>${resumeData.personalInfo.email}</div>` : ''}
        ${resumeData.personalInfo.phone ? `<div>${resumeData.personalInfo.phone}</div>` : ''}
        ${resumeData.personalInfo.location ? `<div>${resumeData.personalInfo.location}</div>` : ''}
      </div>
      <div class="contact-info" style="margin-top: 0.25rem;">
        ${resumeData.personalInfo.linkedin ? `<div>${resumeData.personalInfo.linkedin}</div>` : ''}
        ${resumeData.personalInfo.portfolio ? `<div>${resumeData.personalInfo.portfolio}</div>` : ''}
      </div>
    </div>

    ${resumeData.summary ? `
    <div class="section">
      <h3 class="section-heading">Professional Summary</h3>
      <p style="font-size: 0.875rem;">${resumeData.summary}</p>
    </div>
    ` : ''}

    ${resumeData.experience.length > 0 ? `
    <div class="section">
      <h3 class="section-heading">Professional Experience</h3>
      ${resumeData.experience.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <div>
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company}, ${exp.location}</div>
            </div>
            <div class="period">${exp.period}</div>
          </div>
          ${exp.description ? `<p style="font-size: 0.875rem; margin-top: 0.5rem;">${exp.description}</p>` : ''}
          ${exp.achievements && exp.achievements.length > 0 ? `
            <ul class="achievements">
              ${exp.achievements.filter(achievement => achievement.trim()).map(achievement => `
                <li>${achievement}</li>
              `).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${resumeData.education.length > 0 ? `
    <div class="section">
      <h3 class="section-heading">Education</h3>
      ${resumeData.education.map(edu => `
        <div class="education-item">
          <div class="education-header">
            <div>
              <div class="degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
              <div class="institution">${edu.institution}</div>
            </div>
            <div class="period">${edu.period}</div>
          </div>
          ${(edu.gpa || edu.additionalInfo) ? `
            <div style="font-size: 0.75rem; margin-top: 0.25rem;">
              ${edu.gpa ? `GPA: ${edu.gpa}` : ''} 
              ${(edu.gpa && edu.additionalInfo) ? ', ' : ''}
              ${edu.additionalInfo || ''}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${resumeData.skills.length > 0 ? `
    <div class="section">
      <h3 class="section-heading">Skills</h3>
      <div class="skills-list">
        ${resumeData.skills.filter(skill => skill.trim()).map((skill, i) => `
          ${skill}${i < resumeData.skills.length - 1 ? '<span class="skill-dot">•</span>' : ''}
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${resumeData.certifications.length > 0 ? `
    <div class="section">
      <h3 class="section-heading">Certifications</h3>
      <ul class="achievements">
        ${resumeData.certifications.map(cert => `
          <li>${cert.name} ${cert.issuer ? `(${cert.issuer})` : ''} ${cert.date ? `- ${cert.date}` : ''}</li>
        `).join('')}
      </ul>
    </div>
    ` : ''}
  `;
}

function generateMinimalTemplate(resumeData: Resume): string {
  return `
    <style>
      .minimal-header {
        margin-bottom: 1rem;
      }
      .minimal-header h1 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
      }
      .minimal-header h2 {
        font-size: 1rem;
        color: #666;
        margin: 0.25rem 0;
        font-weight: normal;
      }
      .contact-info {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: #666;
        margin-top: 0.5rem;
      }
      .divider {
        border-top: 1px solid #eee;
        margin: 1rem 0;
      }
      .section {
        margin-bottom: 1.25rem;
      }
      .section-heading {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }
      .experience-item, .education-item {
        margin-bottom: 0.75rem;
      }
      .experience-header, .education-header {
        display: flex;
        justify-content: space-between;
      }
      .job-title, .degree {
        font-size: 0.875rem;
        font-weight: 500;
      }
      .company, .institution {
        font-size: 0.75rem;
        color: #666;
      }
      .period {
        font-size: 0.75rem;
        color: #666;
      }
      .description {
        font-size: 0.75rem;
        color: #666;
        margin-top: 0.25rem;
      }
      .achievements {
        list-style-type: disc;
        padding-left: 1.25rem;
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: #666;
      }
      .two-columns {
        display: flex;
        gap: 1rem;
      }
      .column {
        flex: 1;
      }
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        margin-top: 0.5rem;
      }
      .skill {
        background-color: #f5f5f5;
        border-radius: 9999px;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        color: #666;
      }
    </style>

    <div class="minimal-header">
      <h1>${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</h1>
      <h2>${resumeData.personalInfo.title}</h2>
      <div class="contact-info">
        ${resumeData.personalInfo.email ? `<div>${resumeData.personalInfo.email}</div>` : ''}
        ${resumeData.personalInfo.phone ? `<div>• ${resumeData.personalInfo.phone}</div>` : ''}
        ${resumeData.personalInfo.location ? `<div>• ${resumeData.personalInfo.location}</div>` : ''}
        ${resumeData.personalInfo.linkedin ? `<div>• ${resumeData.personalInfo.linkedin}</div>` : ''}
        ${resumeData.personalInfo.portfolio ? `<div>• ${resumeData.personalInfo.portfolio}</div>` : ''}
      </div>
    </div>

    <div class="divider"></div>

    ${resumeData.summary ? `
    <div class="section">
      <p style="font-size: 0.875rem;">${resumeData.summary}</p>
    </div>
    ` : ''}

    ${resumeData.experience.length > 0 ? `
    <div class="section">
      <h3 class="section-heading">Experience</h3>
      ${resumeData.experience.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <div>
              <div class="job-title">${exp.title} @ ${exp.company}</div>
            </div>
            <div class="period">${exp.period}</div>
          </div>
          ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
          ${exp.achievements && exp.achievements.length > 0 ? `
            <ul class="achievements">
              ${exp.achievements.filter(achievement => achievement.trim()).map(achievement => `
                <li>${achievement}</li>
              `).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${resumeData.education.length > 0 ? `
    <div class="section">
      <h3 class="section-heading">Education</h3>
      ${resumeData.education.map(edu => `
        <div class="education-item">
          <div class="education-header">
            <div>
              <div class="degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
              <div class="institution">${edu.institution}</div>
            </div>
            <div class="period">${edu.period}</div>
          </div>
          ${(edu.gpa || edu.additionalInfo) ? `
            <div class="description">
              ${edu.gpa ? `GPA: ${edu.gpa}` : ''} 
              ${(edu.gpa && edu.additionalInfo) ? ', ' : ''}
              ${edu.additionalInfo || ''}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="two-columns">
      ${resumeData.skills.length > 0 ? `
      <div class="column">
        <h3 class="section-heading">Skills</h3>
        <div class="skills-list">
          ${resumeData.skills.filter(skill => skill.trim()).map(skill => `
            <span class="skill">${skill}</span>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${resumeData.certifications.length > 0 ? `
      <div class="column">
        <h3 class="section-heading">Certifications</h3>
        <ul class="achievements">
          ${resumeData.certifications.map(cert => `
            <li>${cert.name} ${cert.date ? `(${cert.date})` : ''}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
  `;
}

function generateCreativeTemplate(resumeData: Resume): string {
  return `
    <style>
      .creative-container {
        display: flex;
        height: 100%;
      }
      .sidebar {
        width: 33.333%;
        background-color: #3B82F6;
        color: white;
        padding: 1.5rem;
      }
      .content {
        width: 66.667%;
        padding: 1.5rem;
      }
      .sidebar-header {
        margin-top: 1.5rem;
        margin-bottom: 2rem;
      }
      .sidebar-header h1 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
      }
      .sidebar-header h2 {
        font-size: 1rem;
        opacity: 0.9;
        margin: 0.5rem 0 0 0;
        font-weight: 500;
      }
      .sidebar-section {
        margin-bottom: 2rem;
      }
      .sidebar-heading {
        font-size: 0.875rem;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
        letter-spacing: 0.05em;
      }
      .contact-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }
      .contact-icon {
        width: 1.25rem;
        margin-right: 0.5rem;
        text-align: center;
      }
      .skill-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .skill-dot {
        width: 0.5rem;
        height: 0.5rem;
        background-color: white;
        border-radius: 9999px;
        margin-right: 0.5rem;
      }
      .skill-text {
        font-size: 0.875rem;
      }
      .cert-item {
        margin-bottom: 0.75rem;
      }
      .cert-name {
        font-size: 0.875rem;
        font-weight: 500;
      }
      .cert-info {
        font-size: 0.75rem;
        opacity: 0.8;
      }
      .content-section {
        margin-bottom: 1.5rem;
      }
      .content-heading {
        color: #3B82F6;
        font-size: 1rem;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
        letter-spacing: 0.05em;
      }
      .timeline-item {
        position: relative;
        padding-left: 1rem;
        margin-bottom: 1rem;
        border-left: 2px solid rgba(59, 130, 246, 0.3);
      }
      .timeline-dot {
        position: absolute;
        width: 0.75rem;
        height: 0.75rem;
        background-color: #3B82F6;
        border-radius: 9999px;
        left: -0.375rem;
        top: 0.25rem;
      }
      .timeline-title {
        font-size: 0.875rem;
        font-weight: bold;
        color: #333;
      }
      .timeline-subtitle {
        font-size: 0.875rem;
        color: #666;
      }
      .timeline-period {
        font-size: 0.75rem;
        color: #666;
      }
      .timeline-details {
        font-size: 0.75rem;
        color: #666;
        margin-top: 0.25rem;
      }
      .timeline-list {
        list-style-type: disc;
        padding-left: 1.25rem;
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: #666;
      }
      .timeline-list li {
        margin-bottom: 0.25rem;
      }
    </style>

    <div class="creative-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h1>${resumeData.personalInfo.firstName}<br/>${resumeData.personalInfo.lastName}</h1>
          <h2>${resumeData.personalInfo.title}</h2>
        </div>

        <!-- Contact Info -->
        <div class="sidebar-section">
          <h3 class="sidebar-heading">Contact</h3>
          <div>
            ${resumeData.personalInfo.email ? `
              <div class="contact-item">
                <div class="contact-icon">📧</div>
                <div>${resumeData.personalInfo.email}</div>
              </div>
            ` : ''}
            ${resumeData.personalInfo.phone ? `
              <div class="contact-item">
                <div class="contact-icon">📱</div>
                <div>${resumeData.personalInfo.phone}</div>
              </div>
            ` : ''}
            ${resumeData.personalInfo.location ? `
              <div class="contact-item">
                <div class="contact-icon">📍</div>
                <div>${resumeData.personalInfo.location}</div>
              </div>
            ` : ''}
            ${resumeData.personalInfo.linkedin ? `
              <div class="contact-item">
                <div class="contact-icon">🔗</div>
                <div>${resumeData.personalInfo.linkedin}</div>
              </div>
            ` : ''}
            ${resumeData.personalInfo.portfolio ? `
              <div class="contact-item">
                <div class="contact-icon">🌐</div>
                <div>${resumeData.personalInfo.portfolio}</div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Skills -->
        ${resumeData.skills.length > 0 ? `
        <div class="sidebar-section">
          <h3 class="sidebar-heading">Skills</h3>
          <div>
            ${resumeData.skills.filter(skill => skill.trim()).map(skill => `
              <div class="skill-item">
                <div class="skill-dot"></div>
                <div class="skill-text">${skill}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Certifications -->
        ${resumeData.certifications.length > 0 ? `
        <div class="sidebar-section">
          <h3 class="sidebar-heading">Certifications</h3>
          <div>
            ${resumeData.certifications.map(cert => `
              <div class="cert-item">
                <div class="cert-name">${cert.name}</div>
                <div class="cert-info">${cert.issuer} ${cert.date ? `• ${cert.date}` : ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Main Content -->
      <div class="content">
        <!-- Summary -->
        ${resumeData.summary ? `
        <div class="content-section">
          <h3 class="content-heading">About Me</h3>
          <p style="font-size: 0.875rem;">${resumeData.summary}</p>
        </div>
        ` : ''}

        <!-- Experience -->
        ${resumeData.experience.length > 0 ? `
        <div class="content-section">
          <h3 class="content-heading">Experience</h3>
          ${resumeData.experience.map(exp => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-title">${exp.title}</div>
              <div style="display: flex; justify-content: space-between;">
                <div class="timeline-subtitle">${exp.company}</div>
                <div class="timeline-period">${exp.period}</div>
              </div>
              ${exp.description ? `<div class="timeline-details">${exp.description}</div>` : ''}
              ${exp.achievements && exp.achievements.length > 0 ? `
                <ul class="timeline-list">
                  ${exp.achievements.filter(achievement => achievement.trim()).map(achievement => `
                    <li>${achievement}</li>
                  `).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Education -->
        ${resumeData.education.length > 0 ? `
        <div class="content-section">
          <h3 class="content-heading">Education</h3>
          ${resumeData.education.map(edu => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
              <div style="display: flex; justify-content: space-between;">
                <div class="timeline-subtitle">${edu.institution}</div>
                <div class="timeline-period">${edu.period}</div>
              </div>
              ${(edu.gpa || edu.additionalInfo) ? `
                <div class="timeline-details">
                  ${edu.gpa ? `GPA: ${edu.gpa}` : ''} 
                  ${(edu.gpa && edu.additionalInfo) ? ', ' : ''}
                  ${edu.additionalInfo || ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>
  `;
}
