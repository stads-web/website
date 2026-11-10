// Fixed template on purpose: no user-supplied input may end up in this mail,
// otherwise the contact form could be abused as a spam relay.
const DE = [
  "vielen Dank für Ihre Anfrage und Ihr Interesse an einer Zusammenarbeit mit STADS. Wir haben Ihre Nachricht erhalten und melden uns in den nächsten Tagen bei Ihnen.",
  "Bei Rückfragen können Sie einfach auf diese E-Mail antworten.",
];
const EN = [
  "thank you for your request and your interest in working with STADS. We have received your message and will get back to you within the next few days.",
  "If you have any questions, simply reply to this email.",
];

const SIGNATURE_TEXT = `--
Cooperation Team
STADS e.V. · Universität Mannheim
anfragen@stads.de · stads.de
Schloss, 68131 Mannheim
Students' Association for Data Analytics & Statistics | Vereinsregister Mannheim VR701996
Vertretungsberechtigter Vorstand: Merle Dehmel, Suki Liv Becker, Fynn Graubitz`;

const SIGNATURE_HTML = `<p style="font-size: 18px; color: rgb(0, 41, 117);"><font face="Arial">--</font></p>
<table border="0" cellspacing="0" width="100%">
  <tr>
    <td width="90"><img src="LOGO_URL" width="90" alt="STADS Logo" /></td>
    <td></td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial; padding-top: 17px;">
  <tbody>
    <tr>
      <td style="vertical-align: top; padding-right: 20px">
        <h2 style="margin: 0px; font-size: 18px; color: rgb(0, 41, 117); font-weight: 600;"><font face="Arial">Cooperation Team</font></h2>
        <p style="margin: 0px; color: rgb(0, 41, 117); font-size: 14px; line-height: 22px; padding-top: 7px;">STADS e.V.</p>
        <p style="margin: 0px; color: rgb(0, 41, 117); font-size: 14px; line-height: 22px;">Universit&auml;t Mannheim</p>
      </td>
      <td style="width: 1px; border-bottom: none; border-left: 1px solid rgb(0, 46, 133);"></td>
      <td width="15"><div></div></td>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" style="vertical-align: middle; font-size: medium; font-family: Arial;">
          <tbody>
            <tr height="25" style="vertical-align: middle">
              <td width="30" style="vertical-align: middle; padding-left: 10px; padding-right: 10px;"><img src="https://lh3.googleusercontent.com/d/107VBo0PnQzciE75nkkCsky4TwGqYKQ_Z" alt="E-Mail" width="13" style="display: block" /></td>
              <td><a href="mailto:anfragen@stads.de" style="text-decoration: none; color: rgb(0, 41, 117); font-size: 12px;">anfragen&#64;stads.de</a></td>
            </tr>
            <tr height="25" style="vertical-align: middle">
              <td width="30" style="vertical-align: middle; padding-left: 10px; padding-right: 10px;"><img src="https://lh3.googleusercontent.com/d/1j3DOa0goGqjPHwTCWccL6I9E5pJNNtx6" alt="Website" width="13" style="display: block" /></td>
              <td><a href="https://stads.de/" style="text-decoration: none; color: rgb(0, 41, 117); font-size: 12px;">stads.de</a></td>
            </tr>
            <tr height="25" style="vertical-align: middle">
              <td width="30" style="vertical-align: middle; padding-left: 10px; padding-right: 10px;"><img src="https://lh3.googleusercontent.com/d/10od4vtC7f4432-6-HMe6GvATroEGFXXP" alt="Ort" width="13" style="display: block" /></td>
              <td><a href="https://maps.app.goo.gl/YkStcxceiYACJzMS7" style="text-decoration: none; color: rgb(0, 41, 117); font-size: 12px;">Schloss, 68131 Mannheim</a></td>
            </tr>
            <tr height="25" style="vertical-align: middle">
              <td width="30" style="vertical-align: middle; padding-left: 10px; padding-right: 10px;"><img src="https://lh3.googleusercontent.com/d/1RtqwBJbBx4CHlwcj1DBGPiVHGp6KW8Hq" alt="LinkedIn" width="13" style="display: block" /></td>
              <td><a href="https://www.linkedin.com/company/stadsmannheim/" style="text-decoration: none; color: rgb(0, 41, 117); font-size: 12px;">STADS auf LinkedIn!</a></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p style="font-size: 12px; color: rgb(0, 41, 117); max-width: 400px; padding-top: 15px;"><i><font face="Arial">Students' Association for Data Analytics &amp; Statistics | Vereinsregister&nbsp;Mannheim&nbsp;VR701996</font></i></p>
<p style="font-size: 12px; color: rgb(0, 41, 117); max-width: 400px; font-weight: 700;"><font face="Arial">inspiring minds, shaping data.</font></p>
<p style="font-size: 12px; color: rgb(0, 41, 117); padding-top: 3px;"><i><font face="Arial">Vertretungsberechtigter Vorstand: Merle Dehmel, Suki Liv Becker, Fynn Graubitz</font></i></p>
<p style="font-size: 14px; color: rgb(128, 128, 128); padding-top: 3px; font-family: helvetica; font-weight: 100;"><strong>Vertraulichkeitshinweis:</strong> Diese E-Mail ist vertraulich. Wenn Sie diese irrt&uuml;mlich erhalten haben, benachrichtigen Sie uns bitte sofort und l&ouml;schen Sie die Mail. Unbefugtes Kopieren oder Weitergeben ist untersagt. F&uuml;r Viren oder &Uuml;bertragungsfehler wird keine Haftung &uuml;bernommen.</p>
<p style="font-size: 14px; color: rgb(128, 128, 128); padding-top: 3px; font-family: helvetica; font-weight: 100;"><strong>Confidentiality Note:</strong> This email is confidential. If received in error, please notify us immediately and delete it. Unauthorized copying or sharing is prohibited. No liability is assumed for viruses or transmission errors.</p>
<p style="font-size: 14px; color: rgb(50, 181, 33); padding-top: 7px; font-family: helvetica; font-weight: 500;">Please consider the Environment before printing. &#127793;</p>`;

const p = (t: string) => `<p style="font-family: Arial; font-size: 14px; line-height: 22px; color: rgb(0, 41, 117);">${t}</p>`;

export function confirmationMail(logoUrl: string) {
  const text = [
    "Guten Tag,", "", ...DE.flatMap((t) => [t, ""]), "Viele Grüße", "Ihr STADS Cooperation Team",
    "", "---", "",
    "Hello,", "", ...EN.flatMap((t) => [t, ""]), "Best regards", "Your STADS Cooperation Team",
    "", SIGNATURE_TEXT,
  ].join("\n");
  const html = [
    p("Guten Tag,"), ...DE.map(p), p("Viele Grüße<br>Ihr STADS Cooperation Team"),
    '<hr style="border: none; border-top: 1px solid rgb(0, 46, 133);">',
    p("Hello,"), ...EN.map(p), p("Best regards<br>Your STADS Cooperation Team"),
    SIGNATURE_HTML.split("LOGO_URL").join(logoUrl),
  ].join("\n");
  return { subject: "Ihre Anfrage bei STADS / Your request to STADS", text, html };
}
