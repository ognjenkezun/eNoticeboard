using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElektronskaOglasnaTabla.Api.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ElektronskaOglasnaTabla.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailSender _emailSender;

        public EmailController(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPassword()
        {
            //await _emailSender.SendEmailAsync();

            return Ok();
        }
    }
}