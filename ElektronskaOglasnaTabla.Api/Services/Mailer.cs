using ElektronskaOglasnaTabla.Api.Interfaces;
using ElektronskaOglasnaTabla.Domain.Models;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Hosting;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElektronskaOglasnaTabla.Api.Services
{
    //public class Mailer : IMailer
    public class Mailer
    {
        private readonly SmtpSettings _smtpSettings;
        //private readonly IWebHostEnvironment _env;

        public Mailer(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
            //_env = env;
        }

        //public Task SendEmailAsync(string email, string subject, string body)
        //{
        //    try
        //    {
        //        var message = new MimeMessage();
        //        message.From.Add(new MailboxAddress(_smtpSettings.SenderName, _smtpSettings.SenderEmail));
        //        message.To.Add(new MailboxAddress(email));
        //        message.Subject = subject;
        //        message.Body = new TextPart("html")
        //        {
        //            Text = body
        //        };

        //        using (var client = new SmtpClient())
        //        {
        //            client.ServerCertificateValidationCallback = (s, c, h, e) => true;

        //            await client.
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        throw new InvalidOperationException(e.Message);
        //    }
        //}
    }
}
