import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION || 'ap-south-1',
});

const ses = new AWS.SES();

export const verifyEmailAddresses = async (emails) => {
  try {
    const verificationPromisses = emails.map(async (email) => {
      const params = {
        EmailAddress: email,
      };
      return await ses.verifyEmailIdentity(params).promise();
    });
  } catch (error) {
    console.log('Faild to verify email address ', error);
    return false;
  }
};

export const sendEmail = async (emails, otp) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background:#1f4fd8; padding:20px; text-align:center; color:#ffffff;">
                    <h2 style="margin:0;">OTP Verification</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333; font-size:14px; line-height:1.6;">
                    <p>Hello,</p>
                    <p>Please use the following One-Time Password to continue:</p>

                    <div style="margin:30px 0; text-align:center;">
                      <span style="
                        display:inline-block;
                        padding:15px 25px;
                        font-size:28px;
                        letter-spacing:6px;
                        font-weight:bold;
                        color:#1f4fd8;
                        border:1px dashed #1f4fd8;
                        border-radius:6px;
                      ">
                        ${otp}
                      </span>
                    </div>

                    <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                    <p>If you did not request this code, please ignore this email.</p>

                    <p style="margin-top:30px;">
                      Regards,<br />
                      <strong>Your Support Team</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#777;">
                    © 2025 
                    <a href="https://cafe-i3f0.onrender.com/"
                      style="color:#777; text-decoration:none;"
                      target="_blank">
                      cafe-i3f0.onrender.com
                    </a>. 
                    All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const params = {
    Source: 'midnytcafe7@gmail.com',
    Destination: {
      ToAddresses: emails,
    },
    Message: {
      Subject: {
        Data: 'Your OTP Verification Code',
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlTemplate,
          Charset: 'UTF-8',
        },
        Text: {
          Data: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
          Charset: 'UTF-8',
        },
      },
    },
  };

  try {
    const data = await ses.sendEmail(params).promise();
  } catch (error) {
    console.log('failed to send message', error);
    throw error;
  }
};
