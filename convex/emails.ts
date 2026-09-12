import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

interface BrevoSendResult {
  success: boolean;
  messageId?: string;
  code?: string;
  message?: string;
}

/**
 * Generate responsive HTML email template for admission approval & password setup
 */
export function generatePasswordSetupEmailHtml(params: {
  studentName: string;
  universityEmail: string;
  setupUrl: string;
  applicationId?: string;
}): string {
  const { studentName, universityEmail, setupUrl, applicationId } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admission Approved - Iqra University</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #060d1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #060d1a;
      padding: 40px 10px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    .header {
      background: linear-gradient(135deg, #0b1a30 0%, #003366 100%);
      padding: 36px 30px;
      text-align: center;
      border-bottom: 3px solid #d4af37;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 6px 0 0;
      color: #d4af37;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .content {
      padding: 36px 32px;
      line-height: 1.6;
      font-size: 15px;
      color: #1e293b;
    }
    .badge {
      display: inline-block;
      background-color: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 18px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .hero-text {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 12px;
    }
    .details-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .details-label {
      color: #64748b;
      font-weight: 500;
    }
    .details-value {
      color: #0f172a;
      font-weight: 700;
      font-family: monospace;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0 24px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #0066cc 0%, #004c99 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      padding: 16px 36px;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(0, 102, 204, 0.35);
      letter-spacing: 0.3px;
    }
    .fallback-link {
      font-size: 12px;
      color: #64748b;
      word-break: break-all;
      background-color: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      margin-top: 10px;
    }
    .footer {
      background-color: #0b1a30;
      color: #94a3b8;
      padding: 24px 30px;
      font-size: 12px;
      text-align: center;
      line-height: 1.5;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>IQRA UNIVERSITY</h1>
        <p>Chak Shezad Campus, Islamabad</p>
      </div>
      
      <div class="content">
        <div class="badge">Official Admission Decision</div>
        <div class="hero-text">Congratulations, ${studentName}!</div>
        <p>
          We are pleased to inform you that your admission application <strong>${applicationId || ""}</strong> has been officially reviewed and <strong>Approved</strong> by the Admissions Committee. Welcome to Iqra University!
        </p>

        <div class="details-box">
          <div style="font-size: 13px; font-weight: 700; color: #0066cc; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
            Your Official University Identity
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: #64748b; font-size: 13px;">Student Name:</span>
            <span style="color: #0f172a; font-weight: 700; font-size: 13px; float: right;">${studentName}</span>
          </div>
          <div style="clear: both; margin-bottom: 8px;">
            <span style="color: #64748b; font-size: 13px;">Assigned University Email:</span>
            <span style="color: #0066cc; font-weight: 700; font-family: monospace; font-size: 13px; float: right;">${universityEmail}</span>
          </div>
          <div style="clear: both;">
            <span style="color: #64748b; font-size: 13px;">Campus:</span>
            <span style="color: #0f172a; font-weight: 700; font-size: 13px; float: right;">Islamabad Campus</span>
          </div>
          <div style="clear: both;"></div>
        </div>

        <p style="margin-top: 16px;">
          To complete your enrollment and access the Student Portal, LMS, and academic services, please configure your permanent university password using the secure link below:
        </p>

        <div class="cta-container">
          <a href="${setupUrl}" class="button" target="_blank">
            Set University Account Password &rarr;
          </a>
        </div>

        <div style="margin-top: 24px;">
          <p style="font-size: 12px; color: #64748b; margin-bottom: 6px;">
            If the button above does not work, copy and paste this link into your browser:
          </p>
          <div class="fallback-link">
            <a href="${setupUrl}" style="color: #0066cc; text-decoration: none;" target="_blank">${setupUrl}</a>
          </div>
        </div>

        <p style="font-size: 12px; color: #ef4444; margin-top: 20px; font-weight: 600;">
          &#9888; Important: This secure link will expire in 48 hours. After setting your password, you will use your official university email (<strong>${universityEmail}</strong>) to log into the Student Portal.
        </p>
      </div>

      <div class="footer">
        <p style="margin: 0 0 6px;">
          <strong>Iqra University - Admissions & Registrar Office</strong><br>
          Chak Shezad Campus, Park Road, Islamabad, Pakistan
        </p>
        <p style="margin: 0; font-size: 11px; color: #64748b;">
          This is an automated system notification regarding your academic admission. Please do not reply directly to this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Convex Action: Dispatch password setup email via Brevo REST API
 */
export const sendPasswordSetupEmail = action({
  args: {
    applicationId: v.id("applications"),
    studentName: v.string(),
    studentEmail: v.string(),
    universityEmail: v.string(),
    setupToken: v.string(),
    appUrl: v.optional(v.string()),
    applicationRefId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<BrevoSendResult> => {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "shakeelbhatti143143@gmail.com";
    const senderName = process.env.BREVO_SENDER_NAME || "Iqra University Admissions";
    const appUrl = (args.appUrl || process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

    console.log(`[Brevo Email] Initiating setup email for application ${args.applicationId}`);
    console.log(`[Brevo Email] Recipient: ${args.studentEmail}, Student: ${args.studentName}`);
    console.log(`[Brevo Email] Assigned university email: ${args.universityEmail}`);

    if (!brevoApiKey) {
      const errorMsg = "BREVO_API_KEY environment variable is not configured in Convex.";
      console.error(`[Brevo Email Error] ${errorMsg}`);
      await ctx.runMutation(api.applications.updateApprovalEmailStatus, {
        applicationId: args.applicationId,
        sent: false,
        recipient: args.studentEmail,
        error: errorMsg,
      });
      return {
        success: false,
        code: "EMAIL_SEND_FAILED",
        message: errorMsg,
      };
    }

    if (!args.studentEmail || !args.studentEmail.includes("@")) {
      const errorMsg = `Invalid recipient email address: "${args.studentEmail}".`;
      console.error(`[Brevo Email Error] ${errorMsg}`);
      await ctx.runMutation(api.applications.updateApprovalEmailStatus, {
        applicationId: args.applicationId,
        sent: false,
        recipient: args.studentEmail,
        error: errorMsg,
      });
      return {
        success: false,
        code: "EMAIL_SEND_FAILED",
        message: errorMsg,
      };
    }

    const setupUrl = `${appUrl}/setup-password?token=${args.setupToken}`;
    const emailHtml = generatePasswordSetupEmailHtml({
      studentName: args.studentName,
      universityEmail: args.universityEmail,
      setupUrl,
      applicationId: args.applicationRefId,
    });

    const payload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: args.studentEmail.trim(),
          name: args.studentName.trim(),
        },
      ],
      subject: `🎉 Congratulations! Admission Approved - Set Your Iqra University Account Password`,
      htmlContent: emailHtml,
    };

    try {
      console.log(`[Brevo Email] Sending POST request to https://api.brevo.com/v3/smtp/email`);
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorDetail =
          responseBody?.message ||
          responseBody?.code ||
          `Brevo API responded with status ${response.status}`;
        console.error(`[Brevo Email Error] HTTP ${response.status}:`, JSON.stringify(responseBody));

        await ctx.runMutation(api.applications.updateApprovalEmailStatus, {
          applicationId: args.applicationId,
          sent: false,
          recipient: args.studentEmail,
          error: errorDetail,
        });

        return {
          success: false,
          code: "EMAIL_SEND_FAILED",
          message: `Application was approved, but the password setup email could not be sent. Brevo error: ${errorDetail}`,
        };
      }

      const messageId = responseBody?.messageId || "brevo-delivered";
      console.log(`[Brevo Email Success] Password setup email sent successfully. MessageId: ${messageId}`);

      await ctx.runMutation(api.applications.updateApprovalEmailStatus, {
        applicationId: args.applicationId,
        sent: true,
        recipient: args.studentEmail,
        messageId,
      });

      return {
        success: true,
        messageId,
      };
    } catch (err: any) {
      const errorMsg = err?.message || "Network or unexpected error while contacting Brevo API.";
      console.error(`[Brevo Email Exception]`, err);

      await ctx.runMutation(api.applications.updateApprovalEmailStatus, {
        applicationId: args.applicationId,
        sent: false,
        recipient: args.studentEmail,
        error: errorMsg,
      });

      return {
        success: false,
        code: "EMAIL_SEND_FAILED",
        message: `Application was approved, but the password setup email could not be sent. Error: ${errorMsg}`,
      };
    }
  },
});
