
'use server';

import nodemailer from 'nodemailer';

interface InquiryData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  content: string;
}

/**
 * 이도건설 관리자에게 상담 문의 내용을 이메일로 전송합니다.
 * 실제 작동을 위해서는 .env 파일에 EMAIL_USER, EMAIL_PASS 설정이 필요합니다.
 */
export async function sendInquiryNotification(data: InquiryData) {
  // 이메일 전송을 위한 트랜스포터 설정
  // Naver 또는 Gmail 등의 SMTP 설정을 사용합니다.
  const transporter = nodemailer.createTransport({
    service: 'naver', // 또는 'gmail'
    host: 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // 보내는 사람 이메일 (예: test@naver.com)
      pass: process.env.EMAIL_PASS, // 이메일 비밀번호 또는 앱 비밀번호
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'yido610@naver.com',
    subject: `[이도건설] 새로운 상담 문의가 접수되었습니다 - ${data.name}님`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #002d5a; border-bottom: 2px solid #0059ab; padding-bottom: 10px;">새로운 상담 문의 내역</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold; width: 120px;">성함/업체명</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">연락처</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">이메일</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email || '미입력'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">문의 분야</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.serviceType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f9f9f9; font-weight: bold; vertical-align: top;">문의 내용</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; white-space: pre-line;">${data.content}</td>
          </tr>
        </table>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">본 메일은 이도건설 홈페이지 시스템에서 자동으로 발송되었습니다.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    // 실제 환경에서는 로그에만 남기고 사용자에게는 성공으로 보여줄 수도 있고, 
    // 실패를 알려줄 수도 있습니다.
    return { success: false, error: 'Email delivery failed' };
  }
}
