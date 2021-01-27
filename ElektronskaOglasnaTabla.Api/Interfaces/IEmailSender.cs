using ElektronskaOglasnaTabla.Api.Services;
using ElektronskaOglasnaTabla.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElektronskaOglasnaTabla.Api.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(EmailMessage message);
    }
}
