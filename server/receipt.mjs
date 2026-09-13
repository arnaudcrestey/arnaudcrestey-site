const mailbox='demande@arnaudcrestey.com';
export const receiptSubject='Votre demande a bien été reçue — Arnaud Crestey';
export function receiptHtml(){return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Merci pour votre message</title></head>
<body style="margin:0;padding:0;background-color:#efede8;color:#242521;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Merci pour votre message. Vous recevrez une réponse dans les meilleurs délais.</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#efede8"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;background-color:#faf8f3;border:1px solid #ded7ca;">
<tr><td align="center" bgcolor="#171b18" style="background-color:#171b18;padding:0 24px;border-bottom:1px solid #a98b59;">
<img src="cid:signature.ac@arnaudcrestey.com" alt="AC — arnaudcrestey.com" width="250" height="250" style="display:block;width:250px;max-width:100%;height:auto;border:0;color:#e0cba5;font-family:Georgia,serif;font-size:20px;">
</td></tr>
<tr><td align="center" style="padding:36px 28px 34px;">
<h1 style="margin:0 0 23px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:400;color:#242521;">Merci pour votre message.</h1>
<p style="margin:0 0 12px;font-size:16px;line-height:1.7;color:#55544e;">Votre demande a bien été reçue.</p>
<p style="margin:0;font-size:16px;line-height:1.7;color:#55544e;">Vous recevrez une réponse<br>dans les meilleurs délais.</p>
<table role="presentation" width="40" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto 22px;"><tr><td height="1" bgcolor="#b3986d" style="font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:#66553c;">Comprendre avant d’agir.</p>
</td></tr>
</table></td></tr></table></body></html>`;}
export function buildReceiptMail(value,logo){
 if(!value.isEmail)return null;
 return {from:{name:'Arnaud Crestey',address:mailbox},to:{address:value.replyTo},replyTo:{address:mailbox},
  envelope:{from:mailbox,to:[value.replyTo]},messageId:`<receipt-${value.requestId}@arnaudcrestey.com>`,
  subject:receiptSubject,
  text:'Merci pour votre message.\n\nVotre demande a bien été reçue. Vous recevrez une réponse dans les meilleurs délais.\n\nComprendre avant d’agir.\narnaudcrestey.com',
  html:receiptHtml(),
  headers:{'Auto-Submitted':'auto-replied','X-Auto-Response-Suppress':'All'},
  attachments:[{filename:'signature-ac.png',content:logo,contentType:'image/png',contentDisposition:'inline',cid:'signature.ac@arnaudcrestey.com'}],
  disableFileAccess:true,disableUrlAccess:true};
}
