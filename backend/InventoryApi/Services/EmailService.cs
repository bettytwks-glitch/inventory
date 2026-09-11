using System.Net;
using System.Net.Mail;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config) => _config = config;

    public async Task SendPasswordResetAsync(string toEmail, string employeeName, string resetLink)
    {
        var s = _config.GetSection("SmtpSettings");

        using var client = new SmtpClient(s["Host"], int.Parse(s["Port"] ?? "25"))
        {
            EnableSsl = bool.Parse(s["EnableSsl"] ?? "false"),
            DeliveryMethod = SmtpDeliveryMethod.Network
        };

        var user = s["Username"];
        var pass = s["Password"];
        if (!string.IsNullOrEmpty(user))
            client.Credentials = new NetworkCredential(user, pass);

        var body = $@"
<p>您好 {employeeName}，</p>
<p>我們收到您的密碼重設申請。請點擊下方連結重設您的 eAssets 密碼：</p>
<p><a href=""{resetLink}"" style=""padding:10px 20px;background:#1976d2;color:#fff;border-radius:6px;text-decoration:none;"">重設密碼</a></p>
<p>此連結將於 <strong>24 小時</strong>後失效。</p>
<p>若非您本人操作，請忽略此郵件。</p>
<br><p>eAssets 資產管理系統</p>";

        var msg = new MailMessage
        {
            From = new MailAddress(s["FromEmail"]!, s["FromName"] ?? "eAssets"),
            Subject = "eAssets — 密碼重設申請",
            Body = body,
            IsBodyHtml = true
        };
        msg.To.Add(toEmail);

        await client.SendMailAsync(msg);
    }
}