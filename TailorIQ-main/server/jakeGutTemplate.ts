import { Resume } from "@shared/schema";

// Jake Gutierrez's resume template based on the LaTeX format provided
export function generateJakeGutTemplate(resumeData: Resume, settings: any = {}): string {
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

  // Use settings or defaults
  const fontSize = settings.fontSize || 11;
  const fontFamily = settings.fontFamily || 'times';
  const lineSpacing = settings.lineSpacing || 1.15;
  const paperSize = settings.paperSize || 'letter';

  return `
    <style>
      /* Reset and base styles */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: ${getFontFamily(fontFamily)};
        color: #000;
        font-size: ${fontSize}pt;
        line-height: ${lineSpacing};
        max-width: ${paperSize === 'letter' ? '8.5in' : '210mm'};
      }
      .resume-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 0.5in;
      }
      a {
        color: #000;
        text-decoration: underline;
      }

      /* Header section */
      .header {
        text-align: center;
        margin-bottom: 16pt;
      }
      .header h1 {
        font-size: 24pt;
        font-weight: bold;
        text-transform: uppercase;
        margin: 0;
        letter-spacing: 1pt;
      }
      .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8pt;
        margin-top: 6pt;
        font-size: 10pt;
      }
      .contact-divider {
        font-weight: normal;
      }
      
      /* Section styles */
      .section {
        margin-bottom: 12pt;
        page-break-inside: avoid;
      }
      .section-heading {
        font-size: 12pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1pt;
        margin-bottom: 6pt;
        border-bottom: 1px solid #000;
        padding-bottom: 2pt;
      }
      
      /* Experience and education items */
      .experience-item, .education-item {
        margin-bottom: 10pt;
        page-break-inside: avoid;
      }
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2pt;
      }
      .company, .institution {
        font-weight: bold;
      }
      .position, .degree {
        font-style: italic;
      }
      .period {
        text-align: right;
      }
      
      /* Lists */
      .achievements {
        margin: 4pt 0 0 16pt;
        padding-left: 6pt;
      }
      .achievements li {
        margin-bottom: 4pt;
        line-height: 1.4;
      }
      
      /* Skills section */
      .skills-container {
        margin-top: 4pt;
      }
      .skills-category {
        margin-bottom: 4pt;
        display: flex;
        align-items: flex-start;
      }
      .skills-category-title {
        font-weight: bold;
        min-width: 100pt;
      }
      .skills-list {
        flex: 1;
      }
    </style>

    <div class="resume-container">
      <!-- Header with name and contact info (following Jake's LaTeX template) -->
      <div class="header">
        <h1>${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}</h1>
        <div class="contact-info">
          ${resumeData.personalInfo.phone ? `${resumeData.personalInfo.phone}` : ''}
          ${resumeData.personalInfo.phone && resumeData.personalInfo.email ? ` <span class="contact-divider">|</span> ` : ''}
          ${resumeData.personalInfo.email ? `<a href="mailto:${resumeData.personalInfo.email}">${resumeData.personalInfo.email}</a>` : ''}
          ${(resumeData.personalInfo.phone || resumeData.personalInfo.email) && resumeData.personalInfo.linkedin ? ` <span class="contact-divider">|</span> ` : ''}
          ${resumeData.personalInfo.linkedin ? `<a href="${resumeData.personalInfo.linkedin}">${resumeData.personalInfo.linkedin.replace('https://', '')}</a>` : ''}
          ${(resumeData.personalInfo.phone || resumeData.personalInfo.email || resumeData.personalInfo.linkedin) && resumeData.personalInfo.portfolio ? ` <span class="contact-divider">|</span> ` : ''}
          ${resumeData.personalInfo.portfolio ? `<a href="${resumeData.personalInfo.portfolio}">${resumeData.personalInfo.portfolio.replace('https://', '')}</a>` : ''}
        </div>
      </div>

      <!-- Education Section - First per Jake's template -->
      ${resumeData.education.length > 0 ? `
      <div class="section">
        <h2 class="section-heading">Education</h2>
        <div class="resume-sub-heading-list">
          ${resumeData.education.map(edu => `
            <div class="education-item">
              <div class="item-header">
                <div class="left-column">
                  <div><span class="institution">${edu.institution}</span></div>
                  <div><span class="degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</span></div>
                </div>
                <div class="right-column">
                  <div class="period">${edu.period}</div>
                </div>
              </div>
              ${(edu.gpa || edu.additionalInfo) ? `
                <div style="font-size: 10pt; margin-top: 2pt;">
                  ${edu.gpa ? `GPA: ${edu.gpa}` : ''} 
                  ${(edu.gpa && edu.additionalInfo) ? ' | ' : ''}
                  ${edu.additionalInfo || ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Experience Section -->
      ${resumeData.experience.length > 0 ? `
      <div class="section">
        <h2 class="section-heading">Experience</h2>
        <div class="resume-sub-heading-list">
          ${resumeData.experience.map(exp => `
            <div class="experience-item">
              <div class="item-header">
                <div class="left-column">
                  <div><span class="company">${exp.company}</span></div>
                  <div><span class="position">${exp.title}</span>${exp.location ? `, ${exp.location}` : ''}</div>
                </div>
                <div class="right-column">
                  <div class="period">${exp.period}</div>
                </div>
              </div>
              ${exp.description ? `<div style="margin-top: 2pt;">${exp.description}</div>` : ''}
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
      </div>
      ` : ''}

      <!-- Projects Section - if needed -->
      ${resumeData.summary ? `
      <div class="section">
        <h2 class="section-heading">Projects</h2>
        <div class="resume-sub-heading-list">
          <div class="project-item">
            <div class="item-header">
              <div class="left-column">
                <div><span class="project-title"><b>Resume Builder</b> | <i>React, Node.js, OpenAI API</i></span></div>
              </div>
              <div class="right-column">
                <div class="period">April 2024 - Present</div>
              </div>
            </div>
            <ul class="achievements">
              <li>Developed a full-stack resume creation tool with customizable templates and AI-powered content assistance</li>
              <li>Implemented dynamic content scaling and PDF export functionality with proper formatting</li>
              <li>Integrated OpenAI API for contextual resume improvement suggestions and real-time feedback</li>
            </ul>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Skills Section -->
      ${resumeData.skills.length > 0 ? `
      <div class="section">
        <h2 class="section-heading">Technical Skills</h2>
        <div class="skills-container">
          <div class="skills-category">
            <div class="skills-category-title">Languages:</div>
            <div class="skills-list">
              ${resumeData.skills.filter(skill => skill.includes('Java') || skill.includes('Python') || skill.includes('C++') || skill.includes('JavaScript') || skill.includes('TypeScript') || skill.includes('SQL') || skill.includes('HTML') || skill.includes('CSS')).length > 0 
                ? resumeData.skills.filter(skill => skill.includes('Java') || skill.includes('Python') || skill.includes('C++') || skill.includes('JavaScript') || skill.includes('TypeScript') || skill.includes('SQL') || skill.includes('HTML') || skill.includes('CSS')).join(', ')
                : resumeData.skills.slice(0, Math.ceil(resumeData.skills.length / 3)).join(', ')}
            </div>
          </div>
          <div class="skills-category">
            <div class="skills-category-title">Frameworks:</div>
            <div class="skills-list">
              ${resumeData.skills.filter(skill => skill.includes('React') || skill.includes('Node') || skill.includes('Express') || skill.includes('Angular') || skill.includes('Vue') || skill.includes('Django') || skill.includes('Flask') || skill.includes('Spring')).length > 0 
                ? resumeData.skills.filter(skill => skill.includes('React') || skill.includes('Node') || skill.includes('Express') || skill.includes('Angular') || skill.includes('Vue') || skill.includes('Django') || skill.includes('Flask') || skill.includes('Spring')).join(', ')
                : resumeData.skills.slice(Math.ceil(resumeData.skills.length / 3), Math.ceil(2 * resumeData.skills.length / 3)).join(', ')}
            </div>
          </div>
          <div class="skills-category">
            <div class="skills-category-title">Developer Tools:</div>
            <div class="skills-list">
              ${resumeData.skills.filter(skill => skill.includes('Git') || skill.includes('Docker') || skill.includes('Cloud') || skill.includes('AWS') || skill.includes('Azure') || skill.includes('CI/CD') || skill.includes('Jenkins')).length > 0 
                ? resumeData.skills.filter(skill => skill.includes('Git') || skill.includes('Docker') || skill.includes('Cloud') || skill.includes('AWS') || skill.includes('Azure') || skill.includes('CI/CD') || skill.includes('Jenkins')).join(', ')
                : resumeData.skills.slice(Math.ceil(2 * resumeData.skills.length / 3)).join(', ')}
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Certifications Section -->
      ${resumeData.certifications.length > 0 ? `
      <div class="section">
        <h2 class="section-heading">Certifications</h2>
        <ul class="achievements">
          ${resumeData.certifications.map(cert => `
            <li>${cert.name} ${cert.issuer ? `(${cert.issuer})` : ''} ${cert.date ? `- ${cert.date}` : ''}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
  `;
}