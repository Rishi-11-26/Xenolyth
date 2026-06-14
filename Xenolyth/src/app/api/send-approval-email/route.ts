import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, product } = body;

    if (!email || !name || !product) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Capitalize product name
    const productName = product.charAt(0).toUpperCase() + product.slice(1);

    const { data, error } = await resend.emails.send({
      from: 'Xenolyth Engineering <onboarding@resend.dev>', // Resend requires this for free tier without custom domain
      to: email,
      subject: `Your ${productName} Beta Access is Approved`,
      html: `
        <div style="font-family: monospace; padding: 20px; color: #111;">
          <h2 style="margin-bottom: 20px;">Beta Access Granted: ${productName}</h2>
          <p>Hello ${name},</p>
          <p>Your request for operational access to <strong>${productName}</strong> has been approved by the Xenolyth admin team.</p>
          <p>You can now launch the product directly from your <a href="https://xenolyth.vercel.app/dashboard">dashboard</a>.</p>
          <br/>
          <p>Regards,</p>
          <p><strong>Xenolyth Engineering Team</strong><br/>xenolyth26@gmail.com</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: 'Failed to send email via Resend' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
