public interface IEmailService
{
    Task SendPasswordResetAsync(string toEmail, string employeeName, string resetLink);
}