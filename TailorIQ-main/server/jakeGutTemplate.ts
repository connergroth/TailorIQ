// server/jakeGutTemplate.ts
import { Resume } from "@shared/schema";

// Jake Gutierrez's resume template based on the LaTeX format provided
export function generateJakeGutTemplate(resumeData: Resume, settings: any = {}): string {
  // Use settings or defaults
  const fontSize = settings.fontSize || 11;
  const fontFamily = settings.fontFamily || 'times';
  const lineSpacing = settings.lineSpacing || 1.15;
  const paperSize = settings.paperSize || 'letter';
  const autoAdjust = settings.autoAdjust !== undefined ? settings.autoAdjust : true;

  // Calculate dynamic font sizing based on content length
  const dynamicFontSize = getDynamicFontSize(resumeData, fontSize);
  const actualFontSize = autoAdjust ? dynamicFontSize : fontSize;

  return `
    <style>
      /* Reset and base styles following Jake's LaTeX template */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: ${getFontFamily(fontFamily)};
        color: #000;
        font-size: ${actualFontSize}pt;
        line-height: ${lineSpacing};
        max-width: ${paperSize === 'letter' ? '8.5in' : '210mm'};
        padding: 0.6in;
      }
      
      a {
        color: #000;
        text-decoration: underline;
      }

      /* Header section */
      .header {
        text-align: center;
        margin-bottom: ${actualFontSize * 0.7}pt;
      }
      
      .header h1 {
        font-size: ${actualFontSize * 2}pt;
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
        font-size: ${actualFontSize * 0.9}pt;
      }
      
      .contact-divider {
        font-weight: normal;
      }
      
      /* Section styles */
      .section {
        margin-bottom: ${actualFontSize * 0.8}pt;
        page-break-inside: avoid;
      }
      
      .section-heading {
        font-size: ${actualFontSize * 1.1}pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5pt;
        margin-bottom: ${actualFontSize * 0.3}pt;
        border-bottom: 1px solid #000;
        padding-bottom: 2pt;
      }
      
      /* Experience and education items */
      .experience-item, .education-item {
        margin-bottom: ${actualFontSize * 0.6}pt;
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
        margin: 3pt 0 0 16pt;
        padding-left: 6pt;
      }
      
      .achievements li {
        margin-bottom: ${calculateMarginBottom(resumeData)}pt;
        line-height: ${calculateLineHeight(resumeData, lineSpacing)};
        font-size: ${calculateAchievementFontSize(resumeData, actualFontSize)}pt;
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
          ${resumeData.personalInfo.linkedin ? `<a href="${resumeData.personalInfo.linkedin}">${resumeData.personalInfo.linkedin.replace(/^https?:\/\//i, '')}</a>` : ''}
          ${(resumeData.personalInfo.phone || resumeData.personalInfo.email || resumeData.personalInfo.linkedin) && resumeData.personalInfo.portfolio ? ` <span class="contact-divider">|</span> ` : ''}
          ${resumeData.personalInfo.portfolio ? `<a href="${resumeData.personalInfo.portfolio}">${resumeData.personalInfo.portfolio.replace(/^https?:\/\//i, '')}</a>` : ''}
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
                <div style="font-size: ${actualFontSize * 0.85}pt; margin-top: 2pt;">
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
              ${exp.description ? `<div style="margin-top: 2pt; font-size: ${actualFontSize * 0.9}pt;">${exp.description}</div>` : ''}
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

      <!-- Technical Skills Section -->
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

// Font family helper function
function getFontFamily(fontFamily: string): string {
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
}

// Calculate dynamic font size based on content
function getDynamicFontSize(resumeData: Resume, baseFontSize: number): number {
  const contentLength = 
    resumeData.summary.length + 
    resumeData.experience.reduce((total, exp) => 
      total + exp.description.length + 
      exp.achievements.reduce((sum, achievement) => sum + achievement.length, 0), 0) + 
    resumeData.education.reduce((total, edu) => 
      total + (edu.additionalInfo ? edu.additionalInfo.length : 0), 0);
  
  if (contentLength > 5000) return baseFontSize * 0.85;
  if (contentLength > 4000) return baseFontSize * 0.9;
  if (contentLength > 3000) return baseFontSize * 0.95;
  return baseFontSize;
}

// Calculate margin bottom for achievements
function calculateMarginBottom(resumeData: Resume): number {
  const totalAchievements = resumeData.experience.reduce(
    (sum, exp) => sum + exp.achievements.length, 0
  );
  
  if (totalAchievements > 15) return 1;
  if (totalAchievements > 10) return 1.5;
  return 2;
}

// Calculate line height for achievements
function calculateLineHeight(resumeData: Resume, baseLineHeight: number): number {
  const totalAchievements = resumeData.experience.reduce(
    (sum, exp) => sum + exp.achievements.length, 0
  );
  
  if (totalAchievements > 15) return baseLineHeight * 0.9;
  if (totalAchievements > 10) return baseLineHeight * 0.95;
  return baseLineHeight;
}

// Calculate achievement font size
function calculateAchievementFontSize(resumeData: Resume, baseFontSize: number): number {
  const totalAchievements = resumeData.experience.reduce(
    (sum, exp) => sum + exp.achievements.length, 0
  );
  
  if (totalAchievements > 15) return baseFontSize * 0.85;
  if (totalAchievements > 10) return baseFontSize * 0.9;
  return baseFontSize * 0.95;
}