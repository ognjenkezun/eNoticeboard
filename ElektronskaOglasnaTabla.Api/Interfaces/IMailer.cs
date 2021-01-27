using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElektronskaOglasnaTabla.Api.Interfaces
{
    public interface IMailer
    {
        Task SendEmailAsync(string email, string subject, string body);
    }
}
