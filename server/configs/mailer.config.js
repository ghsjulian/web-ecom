const nodemailer = require("nodemailer");

const sendMail = async (toEmail) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        let mailOptions = {
            from: "Echoda Web'ghsgobindo@gmail.com'",
            to: toEmail,
            subject: "You Have successfully Subscribed In Our Community.",
            text: "You Have successfully Subscribed In Our Community.",
            html: `<!doctype html><html lang="en"><head>
  <meta charset="utf-8">
  <title>Email Subscribed Successfully!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Small responsive tweak — many email clients ignore this, but some honor it -->
  <style>
    @media only screen and (max-width: 480px) {
      .container { width: 100% !important; }
      .stack-column, .stack-column-center { display: block !important; width: 100% !important; max-width: 100% !important; }
      .stack-column-center { text-align: center !important; }
      .responsive-img { width: 100% !important; height: auto !important; }
      .pad-sm { padding: 12px !important; }
      .h1 { font-size: 22px !important; line-height: 28px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f2f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

  <!-- PREHEADER (hidden) -->
  <div style="display:none; max-height:0; overflow:hidden; font-size:1px; line-height:1px; color:#ffffff; opacity:0;">
    Quick summary — replace this with a short preview text that appears in inbox previews.
  </div>

  <!-- Email wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f2f4f7;">
    <tr>
      <td align="center" style="padding:20px 12px;">

        <!-- Main container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.06);">

          <!-- Header with logo -->
          <tr>
            <td style="padding:20px; text-align:left; background-color:#ffffff;">
              <img src="{{LOGO_URL}}" alt="Logo" width="140" style="display:block; border:0; outline:none; text-decoration:none; max-width:140px;">
            </td>
          </tr>

          <!-- Hero / Greeting -->
          <tr>
            <td style="padding:24px;">
              <h1 class="h1" style="margin:0 0 12px 0; font-size:28px; line-height:36px; color:#111827; font-weight:700;">
                Hello, Welcome To Echoda Web!
              </h1>
              <p style="margin:0 0 18px 0; font-size:16px; line-height:24px; color:#4b5563;">
                Thanks for joining us. We're excited to have you on board. Below is a quick summary and a few resources to get you started.
              </p>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top:18px;">
                <tr>
                  <td align="center">
                    <a href="https://example.com/get-started" target="_blank" style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:6px; display:inline-block; font-weight:600;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 24px;">
              <hr style="border:none; height:1px; background-color:#eef2f6; margin:0;">
            </td>
          </tr>

          <!-- Two-column features -->
          <tr>
            <td style="padding:18px 24px 6px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="stack-column" style="vertical-align:top; padding-right:12px; width:50%;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom:8px;">
                          <strong style="font-size:15px; color:#111827;">Feature One</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#6b7280; font-size:14px; line-height:20px;">
                          Short description of feature one — why it's useful and how it helps the user.
                        </td>
                      </tr>
                    </table>
                  </td>

                  <td class="stack-column" style="vertical-align:top; padding-left:12px; width:50%;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom:8px;">
                          <strong style="font-size:15px; color:#111827;">Feature Two</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#6b7280; font-size:14px; line-height:20px;">
                          Short description of feature two — one sentence that encourages them to learn more.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Secondary content / card -->
          <tr>
            <td style="padding:18px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:6px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0; font-size:14px; color:#374151; line-height:20px;">
                      <strong>Need help?</strong> Check out our <a href="https://example.com/docs" style="color:#2563eb; text-decoration:none;">documentation</a> or reply to this email and our support team will assist you.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer & small print -->
          <tr>
            <td style="padding:20px 24px; background-color:#ffffff;">
              <p style="margin:0 0 12px 0; color:#6b7280; font-size:13px; line-height:20px;">
                If you didn't create an account, no further action is required.
              </p>

              <!-- Social icons (replace # with your links) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                <tr>
                  <td style="padding-right:8px;">
                    <a href="#" target="_blank" style="text-decoration:none;">
                      <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" width="24" height="24" alt="Facebook" style="display:block; border:0;">
                    </a>
                  </td>
                  <td style="padding-right:8px;">
                    <a href="#" target="_blank" style="text-decoration:none;">
                      <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" width="24" height="24" alt="Twitter" style="display:block; border:0;">
                    </a>
                  </td>
                  <td>
                    <a href="#" target="_blank" style="text-decoration:none;">
                      <img src="https://cdn-icons-png.flaticon.com/24/174/174857.png" width="24" height="24" alt="Instagram" style="display:block; border:0;">
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:14px 0 0 0; color:#9ca3af; font-size:12px; line-height:18px;">
                Company Name • 123 Street Name • City, Country
                <br>
                <a href="#" style="color:#9ca3af; text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>

        <!-- small copyright line -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; margin-top:12px;">
          <tr>
            <td style="text-align:center; color:#9ca3af; font-size:12px; padding:8px 12px;">
              © <!-- YEAR --> Company Name. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
        };
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(`\n[!] Error While Sending Mail To ${name} - `, error);
        return false;
    }
};

module.exports = sendMail;
