using drcbackend.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace drcbackend.Repository
{
    public class SmtpSettings
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string ToEmail { get; set; } = string.Empty;
    }
    public class EmailService
    {
        private readonly SmtpSettings _settings;

        public EmailService(IOptions<SmtpSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendContactEmailAsync(ContactRequest request)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(request.Name, _settings.FromEmail));
            message.To.Add(new MailboxAddress("", _settings.ToEmail));
            message.ReplyTo.Add(new MailboxAddress(request.Name, request.Email));
            message.Subject = $"[Contact Form] {request.Subject}";
            message.Body = new TextPart("plain")
            {
                Text = $"From: {request.Name} <{request.Email}>\n\n{request.Body}"
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_settings.Username, _settings.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}